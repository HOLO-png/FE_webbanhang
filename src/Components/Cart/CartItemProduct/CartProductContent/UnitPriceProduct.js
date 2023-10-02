import React from "react";
import { Avatar, Col } from "antd";
import { convertPriceToToken, numberWithCommas } from "../../../../utils";
import { useSelector } from "react-redux";
import { authSelector } from "../../../../Store/Reducer/authReducer";

function UnitPriceProduct(props) {
  const { product } = props;
  const { user } = useSelector(authSelector);
  return (
    <Col className="gutter-row" span={3}>
      <p style={{ color: "#a0a0a0" }}>
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
  );
}

UnitPriceProduct.propTypes = {};

export default UnitPriceProduct;
