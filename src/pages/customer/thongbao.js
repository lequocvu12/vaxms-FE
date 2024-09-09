import Footer from '../../layout/customer/footer/footer'
import logomini from '../../assest/images/logomini.svg'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Select from 'react-select';
import {getMethod, postMethodPayload} from '../../services/request';
import Swal from 'sweetalert2'


function ThongBao(){
    const [vacxinType, setVacxinType] = useState([]);
    const [vacxin, setVacxin] = useState([]);
    const [vacxinSchedule, setVacxinSchedule] = useState([]);
    const [vacxinScheduleChoose, setVacxinScheduleChoose] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [customer, setCustomer] = useState(null);


    useEffect(()=>{
        const checkPayment= async() =>{
            var lichtiem = JSON.parse(localStorage.getItem("lichtiem"));
            var uls = new URL(document.URL)
            var orderId = uls.searchParams.get("orderId");
            var requestId = uls.searchParams.get("requestId");

            var res = await postMethodPayload('/api/customer-schedule/customer/create?orderId='+orderId+'&requestId='+requestId, lichtiem)
            if (res.status < 300) {
                document.getElementById("thanhcong").style.display = 'block'
                document.getElementById("thatbai").style.display = 'none'
            } else {
                document.getElementById("thanhcong").style.display = 'none'
                document.getElementById("thatbai").style.display = 'block'
                if(res.status == 417){
                    var result = await res.json();
                    document.getElementById("errormess").innerHTML = result.defaultMessage
                }
                else{
                    document.getElementById("errormess").innerHTML = result.defaultMessage
                }
            }
        };
        checkPayment();
    }, []);

    return(
     <div className='container-fluid'>
        <div className='container-web'>
            <br/><br/>
            <div>
                <div id="thanhcong">
                    <h3 className='headthanhcong'>Đặt lịch thành công</h3>
                    <p className='notithanhcong'>Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi.</p>
                    <p className='notithanhcong'>Hãy kiểm tra thông tin lịch đặt của bạn trong mục tài khoản</p>
                    <br/><br/>
                    <a href="tai-khoan" class="btn btn-danger">Xem lịch sử lịch đặt</a>
                </div>

                <div id="thatbai">
                    <h3 sclassName='notithanhcong'>Thông báo</h3>
                    <p className='notithanhcong' id="errormess">Bạn chưa hoàn thành thanh toán.</p>
                    <br/><br/>
                    <p>Quay về <a href="index">trang chủ</a></p>
                </div>
            </div>
        </div>
     </div>
    );
}

export default ThongBao;
