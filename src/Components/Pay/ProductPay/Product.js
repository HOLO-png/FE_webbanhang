import React from "react";
import { Avatar, Col, Row } from "antd";
import { convertPriceToToken, numberWithCommas } from "../../../utils";
import { useSelector } from "react-redux";
import { authSelector } from "../../../Store/Reducer/authReducer";

function Product(props) {
  const { product } = props;
  const { user } = useSelector(authSelector);
  return (
    <Row
      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
      className="products-pay__row-products"
    >
      <Col className="gutter-row products-pay__col" span={2}>
        <p className="products-pay__image-product">
          <img src={product.image} alt="" />
        </p>
      </Col>
      <Col className="gutter-row products-pay__col" span={8}>
        <p className="products-pay__name-product">{product.name}</p>
      </Col>
      <Col className="gutter-row products-pay__col" span={3}>
        <p className="products-pay__kind">Loại: {product.capacity.Capacity}</p>
      </Col>
      <Col className="gutter-row products-pay__col" span={3}>
        <p className="products-pay__unit-price">
          {user?.addressWallet ? (
            <>
              {convertPriceToToken(product.price)}
              <Avatar
                size={"small"}
                width="11%"
                src="https://pragmaticintegrator.files.wordpress.com/2017/10/ethereum-logo.png?w=848"
              />
            </>
          ) : (
            <>
              {numberWithCommas(product.price)}
              <sup> đ</sup>
            </>
          )}
        </p>
      </Col>
      <Col className="gutter-row products-pay__col" span={3}>
        <p className="products-pay__amount">{product.qty}</p>
      </Col>
      <Col className="gutter-row products-pay__col flex-end" span={5}>
        <p className="products-pay__price">
          {user?.addressWallet ? (
            <>
              {convertPriceToToken(product.price * product.qty)}
              <Avatar
                size={"small"}
                width="11%"
                src="https://pragmaticintegrator.files.wordpress.com/2017/10/ethereum-logo.png?w=848"
              />
            </>
          ) : (
            <>
              {numberWithCommas(product.price * product.qty)}
              <sup> đ</sup>
            </>
          )}
        </p>
      </Col>
    </Row>
  );
}

Product.propTypes = {};

export default Product;
