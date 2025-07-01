import ThuDauMot from '../assets/images/tdm.png';
import ThanhHoa from '../assets/images/Thanh-hoa.png';
import BinhDuong from '../assets/images/binhduong.jpg';
import DongNai from '../assets/images/dongnai.jpg';
import HCM from '../assets/images/hcm.jpg';
import Hanoi from '../assets/images/hanoi.jpg';
import DaNang from '../assets/images/danang.jpg';
import avt from '../assets/images/avt.jpg'; // Placeholder for agent avatar, replace with actual image

const properties = [
  {
    id: 1,
    title: 'Cho thuê căn hộ C Sky View 80m2 full nội thất',
    price: 9500000,
    area: 80,
    location: 'Thủ Dầu Một, Bình Dương',
    image: ThuDauMot,
    imageCount: 12,
    contact: {
      name: 'Nguyễn Văn A',
      image: avt,
      experience: '5 năm',
      posts: 24,
      phone: '0909 123 ***',
    },
  },
  {
    id: 2,
    title: 'Nhà kinh doanh khu đô thị Mỹ Gia mới xây',
    price: 15000000,
    area: 100,
    location: 'Nha Trang, Khánh Hòa',
    image: ThanhHoa,
    imageCount: 8,
    contact: {
      name: 'Trần Vinh',
      image: avt,
      experience: '9 năm',
      posts: 32,
      phone: '0938 552 ***',
    },
  },
  {
    id: 3,
    title: 'Bán nhà phố liền kề gần AEON Bình Dương',
    price: 2900000000,
    area: 120,
    location: 'Dĩ An, Bình Dương',
    image: BinhDuong,
    imageCount: 15,
    contact: {
      name: 'Lê Thị Bích',
      image: avt,
      experience: '3 năm',
      posts: 12,
      phone: '0912 222 ***',
    },
  },
  {
    id: 4,
    title: 'Căn hộ cao cấp trung tâm Biên Hòa, view sông',
    price: 3200000000,
    area: 95,
    location: 'Biên Hòa, Đồng Nai',
    image: DongNai,
    imageCount: 10,
    contact: {
      name: 'Phạm Văn Cường',
      image: avt,
      experience: '6 năm',
      posts: 40,
      phone: '0908 345 ***',
    },
  },
  {
    id: 5,
    title: 'Officetel cao cấp quận 1, sổ hồng riêng',
    price: 5200000000,
    area: 70,
    location: 'Quận 1, TP.HCM',
    image: HCM,
    imageCount: 20,
    contact: {
      name: 'Nguyễn Thị Mai',
      image: avt,
      experience: '7 năm',
      posts: 65,
      phone: '0937 567 ***',
    },
  },
  {
    id: 6,
    title: 'Căn hộ full nội thất gần hồ Tây',
    price: 3700000000,
    area: 85,
    location: 'Tây Hồ, Hà Nội',
    image: Hanoi,
    imageCount: 18,
    contact: {
      name: 'Vũ Minh Đức',
      image: avt,
      experience: '4 năm',
      posts: 18,
      phone: '0966 888 ***',
    },
  },
  {
    id: 7,
    title: 'Nhà mặt tiền đường biển Mỹ Khê, có sân vườn',
    price: 9800000000,
    area: 150,
    location: 'Sơn Trà, Đà Nẵng',
    image: DaNang,
    imageCount: 14,
    contact: {
      name: 'Trần Lệ Hằng',
      image:avt,
      experience: '10 năm',
      posts: 90,
      phone: '0911 999 ***',
    },
  },
  {
    id: 8,
    title: 'Căn hộ mini đầy đủ tiện nghi, gần khu công nghiệp',
    price: 700000000,
    area: 45,
    location: 'Thuận An, Bình Dương',
    image: BinhDuong,
    imageCount: 6,
    contact: {
      name: 'Ngô Văn Bảo',
      image: avt,
      experience: '2 năm',
      posts: 9,
      phone: '0977 333 ***',
    },
  },
];

export default properties;
