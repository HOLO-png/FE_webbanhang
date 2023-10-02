import React from "react";
import { Avatar, Col, Tag } from "antd";
import { convertPriceToToken, numberWithCommas } from "../../../../utils";
import { useSelector } from "react-redux";
import { authSelector } from "../../../../Store/Reducer/authReducer";
function TotalPriceProduct(props) {
  const { amount, product } = props;
  const { user } = useSelector(authSelector);
  return (
    <Col className="gutter-row" span={3}>
      <Tag color="red" style={{ fontSize: "17px" }}>
        {user?.addressWallet ? (
          <>
            {convertPriceToToken(product.price * amount)}
            <Avatar
              size={"small"}
              width="11%"
              src="https://pragmaticintegrator.files.wordpress.com/2017/10/ethereum-logo.png?w=848"
            />
          </>
        ) : (
          <>
            {numberWithCommas(product.price * amount)}
            <sup> đ</sup>
          </>
        )}
      </Tag>
    </Col>
  );
}

TotalPriceProduct.propTypes = {};

export default TotalPriceProduct;
