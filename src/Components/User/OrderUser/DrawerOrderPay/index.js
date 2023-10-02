import React, { useState } from "react";
import { Button, Drawer, Space, Modal, Avatar } from "antd";
import OrderUserProfile from "./OrderUserProfile";
import OrderProducts from "./OrderProducts";
import { convertPriceToToken, numberWithCommas } from "../../../../utils";
import { useSelector } from "react-redux";
import { authSelector } from "../../../../Store/Reducer/authReducer";

function DrawerOrderPay(props) {
  const {
    visible,
    placement,
    onClose,
    dataOrder,
    photoURL,
    handleCancelOrderProduct,
    handleOrderRecovery,
  } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = useSelector(authSelector);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    handleCancelOrderProduct(dataOrder);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleRenderUI = () => {
    if (dataOrder) {
      if (dataOrder.complete === "pending") {
        return (
          <Button type="dashed" danger onClick={showModal}>
            Hủy Đơn Hàng
          </Button>
        );
      } else if (dataOrder.complete === "cancel") {
        return (
          <Button type="primary" onClick={() => handleOrderRecovery(dataOrder)}>
            Khôi Phục Đơn Hàng
          </Button>
        );
      }
    } else {
      return;
    }
  };

  return (
    <Drawer
      title="Xem chi tiết sản phẩm"
      placement={placement}
      width={500}
      onClose={onClose}
      visible={visible}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onClose}>
            OK
          </Button>
        </Space>
      }
      className="drawer"
    >
      <OrderUserProfile photoURL={photoURL} dataOrder={dataOrder} />
      <hr />
      <OrderProducts dataOrder={dataOrder} />
      <div className="order__total-money">
        {dataOrder && handleRenderUI()}
        <span className="order__total-money-title">Tổng Tiền:</span>
        <span className="order__total-money-text">
          {user?.addressWallet ? (
            <>
              {convertPriceToToken(
                dataOrder &&
                  dataOrder.products.reduce((accumulator, item) => {
                    return accumulator + item.price * item.qty;
                  }, 0) + dataOrder.paymentFee
              )}
              <Avatar
                size={"small"}
                width="11%"
                src="https://pragmaticintegrator.files.wordpress.com/2017/10/ethereum-logo.png?w=848"
              />
            </>
          ) : (
            <>
              {numberWithCommas(
                dataOrder &&
                  dataOrder.products.reduce((accumulator, item) => {
                    return accumulator + item.price * item.qty;
                  }, 0) + dataOrder.paymentFee
              )}
              <sup
                style={{
                  marginTop: "20px",
                }}
              >
                {" "}
                đ
              </sup>
            </>
          )}
        </span>
      </div>
      <Modal
        title="Thông báo"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <h4 style={{ textAlign: "center" }}>
          Bạn có chắc chắn muốn hủy đơn hàng không ?
        </h4>
      </Modal>
    </Drawer>
  );
}

DrawerOrderPay.propTypes = {};

export default DrawerOrderPay;
