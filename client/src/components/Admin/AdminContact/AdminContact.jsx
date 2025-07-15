import React, { useState } from 'react';
import { useGetProfileQuery, useGetContactsQuery, useUpdateContactMutation, useDeleteContactMutation } from '../../../api/apiSlice';
import { skipToken } from '@reduxjs/toolkit/query/react';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import { Modal, Button, Form } from 'react-bootstrap';
import styles from './AdminContact.module.css';
import Toast from '../../Toast/Toast';

const AdminContact = () => {
    const { data: profile = {} } = useGetProfileQuery();
    const { data: contacts = [], isLoading: loadingContacts, refetch } = useGetContactsQuery(
        profile ? { userId: profile.userId, role: profile.role } : skipToken
    );
    const [updateContact, { isLoading: replying }] = useUpdateContactMutation();
    const [deleteContact, { isLoading: deleting }] = useDeleteContactMutation();
    const [toast, setToast] = useState({ message: '', type: '' });
    const [isSuccess, setIsSuccess] = useState(false);

    // State cho modal trả lời
    const [showModal, setShowModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');

    // Hàm định dạng ngày giờ
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Không xác định';
            }
            return new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }).format(date);
        } catch {
            return 'Không xác định';
        }
    };

    // Mở modal và lưu thông tin contact
    const handleOpenModal = (contact) => {
        setSelectedContact(contact);
        setReplyMessage(contact.replymessage || ''); // Khởi tạo với replymessage hiện tại
        setShowModal(true);
    };

    // Đóng modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedContact(null);
        setReplyMessage(selectedContact?.replymessage || '');
        refetch();
    };

    // Gửi phản hồi
    const handleReply = async () => {
        if (!selectedContact || !replyMessage.trim()) {
            setToast({ message: 'Vui lòng nhập nội dung phản hồi!', type: 'error' });
            setIsSuccess(false);
            return;
        }

        try {
            await updateContact({
                id: selectedContact.id,
                replymessage: replyMessage,
                status: 'RESPONDED',
            }).unwrap();
            handleCloseModal();
            setToast({ message: 'Phản hồi đã được gửi!', type: 'success' });
            setIsSuccess(true);
        } catch (error) {
            console.error('Lỗi gửi phản hồi:', error);
            setToast({ message: error?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.', type: 'error' });
            setIsSuccess(false);
        }
    };

    // Xóa liên hệ
    const handleDelete = async (id) => {
        console.log('Deleting contact with ID:', id, 'Type:', typeof id);
        if (!Number.isInteger(Number(id))) {
            setToast({ message: 'ID liên hệ không hợp lệ!', type: 'error' });
            setIsSuccess(false);
            return;
        }
        try {
            const response = await deleteContact(Number(id)).unwrap();
            console.log('Delete API Response:', response);
            setToast({ message: 'Đã xóa liên hệ!', type: 'success' });
            setIsSuccess(true);
            refetch();
        } catch (error) {
            console.error('Delete API Error:', error);
            setToast({
                message: error?.data?.message || 'Lỗi khi xóa liên hệ! Vui lòng thử lại.',
                type: 'error',
            });
            setIsSuccess(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className={`container mt-5 pt-5 ${styles.container}`}>
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
                        <div className={`card text-white bg-warning ${styles.card}`}>
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
                <div className={`card ${styles.card}`}>
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
                                    <th>Phản Hồi</th>
                                    <th>Bất Động Sản</th>
                                    <th>Trạng Thái</th>
                                    <th>Ngày Gửi</th>
                                    <th>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingContacts ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            Đang tải...
                                        </td>
                                    </tr>
                                ) : contacts.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            Không có yêu cầu liên hệ nào.
                                        </td>
                                    </tr>
                                ) : (
                                    contacts.map((contact) => (
                                        <tr
                                            key={contact.id}
                                            className={
                                                contact.status === 'PENDING'
                                                    ? styles.pendingRow
                                                    : styles.respondedRow
                                            }
                                        >
                                            <td>{contact.User?.name || 'N/A'}</td>
                                            <td>{contact.User?.email || 'N/A'}</td>
                                            <td>{contact.message}</td>
                                            <td>{contact.replymessage || 'Chưa có phản hồi'}</td>
                                            <td>{contact.property?.title || 'N/A'}</td>
                                            <td>
                                                <span
                                                    className={
                                                        contact.status === 'PENDING'
                                                            ? styles.statusPending
                                                            : contact.status === 'RESPONDED'
                                                                ? styles.statusResponded
                                                                : styles.statusClosed
                                                    }
                                                >
                                                    {contact.status}
                                                </span>
                                                {/* {contact.status === 'RESPONDED' & contact.updatedat != contact.createdat && (
                                                    <div>Đã Chỉnh Sửa</div>
                                                )} */}
                                            </td>
                                            <td>{formatDate(contact.createdat)}</td>
                                            <td>
                                                {contact.status === 'PENDING' ? (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handleOpenModal(contact)}
                                                        className={styles.actionButton}
                                                    >
                                                        Trả lời
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handleOpenModal(contact)}
                                                        className={styles.actionButton}
                                                    >
                                                        Chỉnh sửa
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className={`ms-2 ${styles.actionButton}`}
                                                    onClick={() => handleDelete(contact.id)}
                                                    disabled={deleting}
                                                >
                                                    {deleting ? 'Đang xóa...' : 'Xóa'}
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