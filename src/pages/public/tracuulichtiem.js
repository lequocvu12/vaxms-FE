import Footer from '../../layout/customer/footer/footer'
import dctracuu from '../../assest/images/dc-tracuu.jpg'
import logomini from '../../assest/images/logomini.svg'
import banner2 from '../../assest/images/banner2.jpg'
import {getMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';



function TraCuuLichTiem(){
    const [item, setItem] = useState([]);
    const [schedule, setSchedule] = useState(null);
    useEffect(()=>{
        const getItem = async() =>{
            var response = await getMethod('/api/vaccine-schedule/public/next-schedule');
            var result = await response.json();
            setItem(result)
        };
        getItem();
    }, []);
  

    async function searchSchedule() {
        var param = document.getElementById("searchschedule").value
        var response = await getMethod('/api/vaccine-schedule/public/next-schedule?param='+param);
        var result = await response.json();
        setItem(result)
    }

    return(
     <div className='container-web'>
        <img src={dctracuu} className='imgtracuulichtiem'/>
        <div className='row'>
                <div className='col-sm-12'>
                    <p className='link-head-section'>
                        <a href="https://vnvc.vn/">Trang chủ</a>
                        <span class="separator"> » </span>
                        <span class="last">Tra cứu lịch tiêm chủng</span>
                    </p>
                    <div className='section-content-web'>
                        <div className='flex-section'>
                            <div className='divsc-dkytiem'><img src={logomini} className='img-section-dky-tiem'/></div>
                            <h2 className='title-dki-tiem-chung'>TRA CỨU LỊCH TIÊM CHỦNG SẮP TỚI</h2>
                        </div>
                    </div>
                    <div className='headertracuu'>
                        <input onKeyUp={searchSchedule} id='searchschedule' className='input-search-schedule' placeholder='Nhập tên vaccine'/>
                        <a href='lich-tiem-da-qua'>Xem lịch tiêm chủng đã qua</a>
                    </div>
                    <table className='table table-bordered tablelichtiemvaccine'> 
                        <thead className='thead'>
                            <tr>
                                <th>STT</th>
                                <th>Tên vaccine</th>
                                <th>Mô tả</th>
                                <th>Nhà sản xuất</th>
                                <th className='col-gre'>Giá bán</th>
                                <th className='col-gre'>Ngày tiêm</th>
                                <th className='col-blue'>Giới hạn</th>
                                <th className='col-blue'>Địa điểm</th>
                                <th className='col-blue'>Tình trạng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {item.map((item, index)=>{
                                return <tr className='pointer hoverschedule' onClick={()=>setSchedule(item)} data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    <td>{index+1}</td>
                                    <td>{item.vaccine.name}</td>
                                    <td>{item.vaccine.description}</td>
                                    <td>{item.vaccine.manufacturer.name}<br/>{item.vaccine.manufacturer.country}</td>
                                    <td className='col-gre'>{formatMoney(item.vaccine.price)}</td>
                                    <td className='col-gre'>{item.startDate} - {item.endDate}</td>
                                    <td className='col-blue'>{item.limitPeople}</td>
                                    <td className='col-blue'>{item.center.centerName}<br/>
                                        {item.center.street},
                                        {item.center.ward},
                                        {item.center.district},
                                        {item.center.city},
                                    </td>
                                    <td className='col-blue'>{item.inStock==true?<span className='whiteText'>Còn</span>:<span className='redText'>Đã hết slot</span>}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Thông tin vaccine</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <table className='table'>
                            <tr>
                                <th>Ảnh</th>
                                <td><img src={schedule==null?'':schedule.vaccine.image} className='imgtableschedule'/></td>
                            </tr>
                            <tr>
                                <th>Tên vaccine</th>
                                <td>{schedule==null?'':schedule.vaccine.name}</td>
                            </tr>
                            <tr>
                                <th>Nhóm tuổi</th>
                                <td>{schedule==null?'':schedule.vaccine.ageGroup.ageRange}</td>
                            </tr>
                            <tr>
                                <th>Mô tả</th>
                                <td>{schedule==null?'':schedule.vaccine.description}</td>
                            </tr>
                            <tr>
                                <th>Giá tiền</th>
                                <td>{schedule==null?'':formatMoney(schedule.vaccine.price)}</td>
                            </tr>
                            <tr>
                                <th>Loại vaccine</th>
                                <td>{schedule==null?'':schedule.vaccine.vaccineType.typeName}</td>
                            </tr>
                            <tr>
                                <th>Nhà máy sản xuất</th>
                                <td>{schedule==null?'':schedule.vaccine.manufacturer.name}</td>
                            </tr>
                            <tr>
                                <th>Quốc gia sản xuất</th>
                                <td>{schedule==null?'':schedule.vaccine.manufacturer.country}</td>
                            </tr>
                        </table>
                    </div>
                    </div>
                </div>
            </div>
     </div>
    );
}

export default TraCuuLichTiem;
