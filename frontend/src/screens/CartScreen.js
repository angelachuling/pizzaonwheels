import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Row, Col, ListGroup, Image, Card, Form, Button} from 'react-bootstrap';
import Message from '../components/Message.component';
//import Loader from '../components/Loader.component';
import {addToCart, removeFromCart} from '../actions/cartActions';


const CartScreen = ({match, location, history}) => {
    const productId = match.params.id;

    const qty = location.search ? Number(location.search.split('=')[1]) : 1;

    const dispatch = useDispatch();

    const cart = useSelector(state => state.cart);
    const {cartItems} = cart;

    useEffect(()=> {
        if(productId) {
            dispatch(addToCart(productId, qty))
        }
    }, [dispatch, productId, qty])

    const removeFromCartHandler = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const checkoutHandler = () => {
        history.push('/login?redirect=shipping')
    }

    return (
        <div>
            <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                <Message>Your cart is empty <Link to='/'> Go Back</Link></Message>
                ) : (
                    <ListGroup varian='flush'>
                        {cartItems.map(item=>(
                            <ListGroup.Item key={item.productId}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item.productId}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}>€{item.price}</Col>
                                    <Col md={2}>
                                    <Form.Control 
                                    as='select' 
                                    value={item.qty} 
                                    onChange={(e)=> dispatch(addToCart(item.productId, Number(e.target.value)))}
                                    >
                                    {[...Array(item.countInStock).keys()].map((x)=>(
                                        <option key={x+1} value={x+1}>
                                            {x+1}
                                        </option>
                                    ))}
                                </Form.Control>

                                    </Col>
                                    <Col md={2}>
                                        <Button type='button' variant='light' onClick={()=> removeFromCartHandler(item.productId)}>
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </Col>

                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )
                }
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h3>Subtotal ({cartItems.reduce((acc, item)=> acc + item.qty, 0)}) Items</h3>
                            <h3>€{cartItems.reduce((acc, item)=> acc + item.qty * item.price, 0).toFixed(2)}</h3>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button 
                            type='button' 
                            className='btn-block' 
                            disabled={cartItems.length === 0} 
                            onClick={checkoutHandler}>
                                Proceed to Checkout
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>

            </Col>
            </Row>
        </div>
    )
}

export default CartScreen;
