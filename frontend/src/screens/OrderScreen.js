import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {PaypalButton} from 'react-paypal-button-v2';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {ListGroup, Image, Card, Row, Col} from 'react-bootstrap';
import Message from '../components/Message.component';
import Loader from '../components/Loader.component';
import {getOrderDetails, payOrder} from '../actions/orderActions';
import { ORDER_PAY_RESET } from '../constants/orderConstants';

const OrderScreen = ({match, history}) => {
    const orderId = match.params.id;

    const [sdkReady, setSdkReady] = useState(false);

    const dispatch = useDispatch();

    const orderDetails = useSelector(state => state.orderDetails);
    const {order, loading, error} = orderDetails;

    console.log('order screen: orderDetails', orderDetails)

    console.log('order screen: order', order)

    const orderPay = useSelector(state => state.orderPay);
    const {loading: loadingPay, success: successPay} = orderPay;

    console.log('orderPay', orderPay)

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin



   if(!loading){
     //calculate prices
    const addDecimals = (num) => {
        return (Math.round(num * 100)/100).toFixed(2)
    }
    order.itemsPrice = Number(addDecimals((order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0))));

   }

    useEffect(()=>{
        console.log('enter useEffect')

        if (!userInfo) {
            history.push('/login')
          }

        //adding paypal script dynamically
        //SDK script adds PayPal functions to HTML documents. to render PayPal button where we need it.
          const addPayPalScript = async () => {
            const {data: clientId} = await axios.get('/api/config/paypal');
            
            console.log('clientId', clientId);

            const script = document.createElement('script');
            script.type='text/javascript';
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`;
            script.async = true;
            script.onload = () => {
                setSdkReady(true);
            }
            document.body.appendChild(script)
        }

        if(!order || successPay || order._id !== orderId){
            dispatch(getOrderDetails(orderId));
            dispatch({type: ORDER_PAY_RESET});
        } else if(!order.isPaid){
            if(!window.paypal){
                console.log('addPayPalScript()')
                addPayPalScript()
            } else {
                setSdkReady(true)
            }
        }
    }, [userInfo, history, order, dispatch, orderId, successPay]);

    const successPaymentHandler = (paymentResult) => {
       console.log('paymentResult', paymentResult);
       dispatch(payOrder(orderId, paymentResult));

    }

    return loading ? (
    <Loader /> ) : 
    error ? (
    <Message variant='danger'>{error}</Message> ) : (
     <>
     <h1>Order {order._id}</h1>
           <Row>
               <Col md={8}>
                   <ListGroup variant='flush'>
                       <ListGroup.Item>
                           <h2>Shipping</h2>
                           <p>
                               <strong>Name:</strong> {' '}{order.user.name}
                           </p>
                           <p>
                               <strong>Email:</strong>{' '}
                               <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                           </p>
                           <p>
                               <strong>Address:{' '}</strong>
                               {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                           </p>
                           {order.isDelivered ? <Message variant='success'>Delivered on {order.deliveredAt}</Message> : <Message variant='danger'>Not delivered</Message>}

                       </ListGroup.Item>

                       <ListGroup.Item>
                           <h2>Payment Method</h2>
                           <p>
                           <strong>Method:{' '}</strong>
                           {order.paymentMethod}
                           </p>
                           {order.isPaid ? <Message variant='success'>Paid on {order.paidAt}</Message> : <Message variant='danger'>Not Paid</Message>}
                       </ListGroup.Item>

                       <ListGroup.Item>
                           <h2>Order Items</h2>
                           {order.orderItems.length === 0 ? <Message>Order is empty</Message> : (
                               <ListGroup variant='flush'>
                                   {order.orderItems.map((item, index)=> (
                                       <ListGroup.Item key={index}>
                                           <Row>
                                               <Col md={1}>
                                                   <Image src={item.image} alt={item.name} fluid rounded/>
                                               </Col>
                                               <Col>
                                                   <Link to={`/product/${item.product}`}>{item.name}</Link>
                                               </Col>
                                               <Col md={4}>
                                                   {item.qty} X €{item.price} = €{item.qty * item.price}
                                               </Col>
                                           </Row>
                                       </ListGroup.Item>
                                   ))}
                               </ListGroup>
                           )}
                       </ListGroup.Item>

                   </ListGroup>
               </Col>
               <Col md={4}>
                   <Card>
                       <ListGroup variant='flush'>
                           <ListGroup.Item>
                               <h2>Order Summary</h2>
                           </ListGroup.Item>

                           <ListGroup.Item>
                               <Row>
                                   <Col>Items</Col>
                                   <Col>€{order.itemsPrice}</Col>
                               </Row>
                           </ListGroup.Item>

                           <ListGroup.Item>
                               <Row>
                                   <Col>Shipping</Col>
                                   <Col>€{order.shippingPrice}</Col>
                               </Row>
                           </ListGroup.Item>

                           <ListGroup.Item>
                               <Row>
                                   <Col>incl. VAT(19%)</Col>
                                   <Col>€{order.vatPrice}</Col>
                               </Row>
                           </ListGroup.Item>

                           <ListGroup.Item>
                               <Row>
                                   <Col>Total</Col>
                                   <Col>€{order.totalPrice}</Col>
                               </Row>
                           </ListGroup.Item>

                           {!order.isPaid && (
                             <ListGroup.Item>
                               {loadingPay && <Loader />}
                               {!sdkReady ? (
                                 <Loader />
                               ) : (
                                 <PaypalButton
                                   amount={order.totalPrice}
                                   onSuccess={successPaymentHandler}
                                 />
                               )}
                             </ListGroup.Item>
                           )}

                       </ListGroup>
                   </Card>
               </Col>
           </Row>
        </>
    )
}

export default OrderScreen;
