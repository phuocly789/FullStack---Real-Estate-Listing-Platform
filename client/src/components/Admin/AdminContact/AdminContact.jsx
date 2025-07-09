// src/components/AdminContact/AdminContact.jsx
import React, { useState } from 'react';
import { useGetProfileQuery, useGetContactsQuery, useUpdateContactMutation } from '../../../api/apiSlice';
import { skipToken } from '@reduxjs/toolkit/query/react';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import { Modal, Button, Form, Toast } from 'react-bootstrap';
import './AdminContact.module.css'; // Tùy chọn: File CSS để tùy chỉnh giao diện

const AdminContact = () => {
    const { data: profile = {} } = useGetProfileQuery();
    const { data: contacts = [], isLoading: loadingContacts } = useGetContactsQuery(
        profile ? { userId: profile.userId, role: profile.role } : skipToken
    );
    const [updateContact, { isLoading: replying }] = useUpdateContactMutation();
    const [toast, setToast] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // State cho modal trả lời
    const [showModal, setShowModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');

    // Mở modal và lưu thông tin contact được chọn
    const handleOpenModal = (contact) => {
        setSelectedContact(contact);
        setShowModal(true);
    };

    // Đóng modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedContact(null);
        setReplyMessage('');
    };

    // Gửi phản hồi
    const handleReply = async () => {
        if (!selectedContact || !replyMessage) return;

        try {
            await updateContact({
                id: selectedContact.id,
                replyMessage,
                status: 'REPLIED',
            }).unwrap();
            hhandleCloseModal();
            setToastMessage('Phản hồi đã được gửi!');
            setIsSuccess(true);

        } catch (error) {
            setToastMessage('Đã có lỗi xảy ra. Vui lòng thử lại.');
            setIsSuccess(false);

        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5 pt-5">
                <h2 className="mb-4">Trang Quản Trị Yêu Cầu Liên Hệ</h2>
                <Toast
                    message={toast.message}
                    type={toast.type}
                    isSuccess={isSuccess}
                    onClose={() => {
                        setToast({ message: '', type: '' });
                        setIsSuccess(null);
                    }}
                />
                <div className="row mb-4">
                    <div className="col-md-4 col-lg-3 mb-3">
                        <div className="card text-white bg-warning">
                            <div className="card-body">
                                <h5 className="card-title">Tổng Yêu Cầu Liên Hệ</h5>
                                <p className="card-text display-6">
                                    {loadingContacts ? '...' : contacts.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bảng danh sách yêu cầu liên hệ */}
                <div className="card">
                    <div className="card-header">
                        <strong>Danh sách Yêu Cầu Liên Hệ Mới Nhất</strong>
                    </div>
                    <div className="card-body table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Tên Người Gửi</th>
                                    <th>Email</th>
                                    <th>Tin Nhắn</th>
                                    <th>Bất Động Sản</th>
                                    <th>Trạng Thái</th>
                                    <th>Ngày Gửi</th>
                                    <th>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingContacts ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            Đang tải...
                                        </td>
                                    </tr>
                                ) : contacts.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            Không có yêu cầu liên hệ nào.
                                        </td>
                                    </tr>
                                ) : (
                                    contacts.map((contact) => (
                                        <tr key={contact.id}>
                                            <td>{contact.User?.name || 'N/A'}</td>
                                            <td>{contact.User?.email || 'N/A'}</td>
                                            <td>{contact.message}</td>
                                            <td>{contact.property?.title || 'N/A'}</td>
                                            <td>{contact.status}</td>
                                            <td>{new Date(contact.createdat).toLocaleDateString()}</td>
                                            <td>
                                                {contact.status !== 'REPLIED' && (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handleOpenModal(contact)}
                                                    >
                                                        Trả lời
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="ms-2"
                                                    onClick={() => useDeleteContactMutation({ id: contact.id })}
                                                >
                                                    Xóa
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal trả lời */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Trả Lời Yêu Cầu Liên Hệ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedContact && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Tên Người Gửi</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedContact.User?.name || 'N/A'}
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={selectedContact.User?.email || 'N/A'}
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Bất Động Sản</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedContact.property?.title || 'N/A'}
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Tin Nhắn Gốc</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={selectedContact.message}
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Nội Dung Phản Hồi</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder="Nhập nội dung phản hồi..."
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleReply} disabled={replying}>
                        {replying ? 'Đang gửi...' : 'Gửi Phản Hồi'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Footer />
        </>
    );
};

export default AdminContact;