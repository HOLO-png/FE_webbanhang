import React from "react";
import { Avatar, Row, Skeleton, Tag } from "antd";
import { convertPriceToToken, numberWithCommas } from "../../../../utils";
import { useSelector } from "react-redux";
import { authSelector } from "../../../../Store/Reducer/authReducer";

function ProductPrice(props) {
  const { productPrice, productPriceOld, productObj, loading, product } = props;
  const { user } = useSelector(authSelector);
  return (
    <>
      {loading ? (
        <Skeleton.Button
          active={true}
          size="large"
          shape="default"
          block={false}
          style={{ width: "100%", marginTop: 10 }}
        />
      ) : (
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          className="product-price"
        >
          <p
            className="product-text"
            style={{
              fontWeight: 600,
              width: user?.addressWallet ? 300 : "unset",
            }}
          >
            {user?.addressWallet && (
              <>
                {convertPriceToToken(productPrice)}
                <Avatar
                  size={"small"}
                  width="11%"
                  src="https://pragmaticintegrator.files.wordpress.com/2017/10/ethereum-logo.png?w=848"
                />
                ={" "}
              </>
            )}

            {!productObj.price
              ? numberWithCommas(productPrice || "")
              : numberWithCommas(productObj.price)}
            <sup> đ</sup>
          </p>
          {+productObj.priceOld ? (
            <p className="product-text-old">
              <i>
                <del>
                  {!productObj.priceOld
                    ? numberWithCommas(productPriceOld || "")
                    : numberWithCommas(productObj.priceOld)}
                  đ
                </del>
              </i>
            </p>
          ) : (
            ""
          )}
          {productObj.priceOld > productObj.price ? (
            <Tag
              color="#f50"
              style={{
                transform: "translateY(-5px)",
                backgroundColor: "red",
                fontSize: "17px",
              }}
            >
              -
              {productObj.priceOld && productObj.price
                ? Math.round(
                    ((productObj.priceOld - productObj.price) /
                      productObj.priceOld) *
                      100
                  )
                : Object.keys(product).length
                ? Math.round(
                    ((product.priceOld - product.price) / product.priceOld) *
                      100
                  )
                : ""}
              %
            </Tag>
          ) : (
            ""
          )}
        </Row>
      )}
    </>
  );
}

ProductPrice.propTypes = {};

export default ProductPrice;
