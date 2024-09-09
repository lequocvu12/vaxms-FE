import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Client } from '@stomp/stompjs';
import avatar from '../../assest/images/avatar.png'
import SockJS from 'sockjs-client';
import {getMethod, postMethod, postMethodPayload} from '../../services/request';

const StaffChat = ()=>{
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [client, setClient] = useState(null);
    const [itemUser, setItemUser] = useState([]);
    const [itemChat, setItemChat] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getItemUser= async() =>{
            var response = await getMethod('/api/chat/staff/getAllUserChat');
            var result = await response.json();
            setItemUser(result)
        };
        getItemUser();
        var userlc = localStorage.getItem("user")
        var email = JSON.parse(userlc).email
        const sock = new SockJS('http://localhost:8080/hello');
        const stompClient = new Client({
          webSocketFactory: () => sock,
          onConnect: () => {
            console.log("WebSocket connected successfully!");
            stompClient.subscribe('/users/queue/messages', (msg) => {
                var Idsender = msg.headers.sender
                appendTinNhanDen(msg.body, Idsender)
            });
          },
          connectHeaders: {
            username: email  // Truyền email vào header khi kết nối
          }
        });
        stompClient.activate();
        setClient(stompClient);
    
        return () => {
          stompClient.deactivate();
        };
    }, []);
    
    
    const sendMessage = () => {
        client.publish({
            destination: '/app/hello/'+user.id,
            body: document.getElementById("contentmess").value,
        });
        append();
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          client.publish({
            destination: '/app/hello/'+user.id,
            body: document.getElementById("contentmess").value,
          });
          append();
        }
    };

    function append() {
        const newChatElement = document.createElement('p'); 
        newChatElement.className = "adminchat";
        newChatElement.textContent = document.getElementById("contentmess").value; 

        document.getElementById('listchatadmin').appendChild(newChatElement);
        var scroll_to_bottom = document.getElementById('listchatadmin');
        scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
        document.getElementById("contentmess").value = ''
    }


    const searchKey= async() =>{
        var param = document.getElementById("keysearchuser").value
        var response = await getMethod('/api/chat/staff/getAllUserChat?search='+param);
        var result = await response.json();
        setItemUser(result)
    };

    async function loadMessage(user){
        var response = await getMethod('/api/chat/staff/getListChat?idreciver='+user.id);
        var result = await response.json();
        setItemChat(result)
        setUser(user);
    };

    function appendTinNhanDen(mess, Idsender) {
        console.log("dender "+Idsender);
        console.log("userid: "+user.id);
        if(Idsender != user.id){
            return;
        }
        const newChatElement = document.createElement('p'); 
        newChatElement.className = "mychat";
        newChatElement.textContent = mess; 
        document.getElementById('listchatadmin').appendChild(newChatElement);
        var scroll_to_bottom = document.getElementById('listchatadmin');
        scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
        document.getElementById("contentmess").value = ''
    }



    return (
        <>
        <div class="row">
                    <div class="col-sm-3">
                        <table class="table table-borderless" id="tableuserchat">
                            <thead>
                                <tr>
                                    <td colspan="2">
                                        <input onKeyUp={searchKey} id="keysearchuser" class="form-control" type="text" placeholder="Tìm kiếm"/>
                                    </td>
                                </tr>
                            </thead>
                            <tbody id="listuserchat">
                            {itemUser.map((item, index)=>{
                                return <tr class="pointer trhoverchat" onClick={()=>loadMessage(item.user)}>
                                    <td class="col45"><img src={avatar} class="imgavatarchat"/></td>
                                    <td>{item.user.email}<span class="timechat">{item.timestamp}</span></td>
                                </tr>
                            })}
                            </tbody>
                        </table>
                    </div>
                    <div class="col-sm-9">
                        {
                        user==null?<></>:
                        <div class="mainchatadmin" id="mainchatadmin">
                            <div class="header-chat-admin form-control">
                                {user.email}
                            </div>
                            <div class="contentchatadmin" id="listchatadmin">
                                {itemChat.map((item, index)=>{
                                    if(item.sender.authorities.name == "Customer"){
                                    return <p class="mychat">{item.content}</p>
                                    }
                                    else{
                                    return <p class="adminchat">{item.content}</p>
                                    }
                                })}
                            </div>
                            <div className='centerchatstaff'></div>
                            <div class="chat-area-footer">
                                <input onKeyDown={handleKeyDown} type="text" id="contentmess" class="inputchatadmin" placeholder="write message" />
                                <button onClick={()=>sendMessage()} class="btn-send-message" id="sendmess"><i class="fa fa-paper-plane"></i></button>
                            </div>
                        </div>
                        }
                    </div>
                </div>
        </>
    );
}

export default StaffChat;