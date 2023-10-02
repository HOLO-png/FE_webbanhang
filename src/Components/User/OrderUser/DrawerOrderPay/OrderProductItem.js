import React, { useState } from "react";
import { Avatar, Image } from "antd";
import { convertPriceToToken, numberWithCommas } from "../../../../utils";
import { useSelector } from "react-redux";
import { authSelector } from "../../../../Store/Reducer/authReducer";

function OrderProductItem(props) {
  const { item } = props;
  const [visibleImage, setVisibleImage] = useState(false);
  const { user } = useSelector(authSelector);
  return (
    <div className="order__product-item">
      <div className="order__product-item-image">
        <Image
          preview={{ visibleImage: false }}
          width={60}
          src={item.image}
          onClick={() => setVisibleImage(true)}
        />
        <div style={{ display: "none" }}>
          <Image.PreviewGroup
            preview={{
              visibleImage,
              onVisibleChange: (vis) => setVisibleImage(vis),
            }}
          >
            <Image src={item.image} />
          </Image.PreviewGroup>
        </div>
      </div>
      <div className="order__product-item-content">
        <div className="order__product-item-content-name">
          <span>{item.name}</span>
        </div>
        <div className="order__product-item-content-capacity">
          <span>{item.capacity.Capacity}</span>
        </div>
      </div>
      <div className="order__product-item-content-amount">
        <span>X {item.qty}</span>
      </div>
      <div className="order__product-item-content-price">
        {user?.addressWallet ? (
          <>
            {convertPriceToToken(item.price)}
            <Avatar
              size={"small"}
              width="11%"
              src="https://pragmaticintegrator.files.wordpress.com/2017/10/ethereum-logo.png?w=848"
            />
          </>
        ) : (
          <>
            {numberWithCommas(item.price)}
            <sup> đ</sup>
          </>
        )}
      </div>
    </div>
  );
}

OrderProductItem.propTypes = {};

export default OrderProductItem;
