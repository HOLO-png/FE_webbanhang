import React from "react";
import { Badge, Form, Input, Modal, Tag } from "antd";
import { useState } from "react";
import { IssuesCloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../Store/Reducer/authReducer";
import {
  ethSelector,
  getMyTokenAmount,
  handleBuyTokens,
} from "../../Store/Reducer/ethReducer";
import { numberWithCommas } from "../../utils";

function BuyTokenModal(props) {
  const { user } = useSelector(authSelector);
  const { accounts, contracts, userTokens, web3 } = useSelector(ethSelector);

  const [open, setOpen] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(0);
  const dispatch = useDispatch();

  const showModal = () => {
    dispatch(
      getMyTokenAmount({ tokenInstance: contracts.tokenInstance, accounts })
    );
    setOpen(true);
  };

  const handleOk = () => {
    if (contracts.tokenSaleInstance !== undefined) {
      if (tokenAmount >= 0) {
        dispatch(
          handleBuyTokens({
            tokenSaleInstance: contracts.tokenSaleInstance,
            tokenAmount,
            web3,
            accounts,
          })
        );
      }
    }

    setTimeout(() => {
      setOpen(false);
      setTokenAmount(0);
    }, 1000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  return (
    <div>
      <div
        className="header__menu__item__user-drawer-accout"
        onClick={showModal}
      >
        <i className="fab fa-centercode"></i>
        <span className="display-name-user">Token</span>
      </div>
      <Modal
        title="Token của bạn"
        centered
        style={{ top: 20 }}
        visible={open}
        okText="Mua"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tag
          icon={<IssuesCloseOutlined style={{ fontSize: "22px" }} />}
          color="success"
          style={{
            display: "flex",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              fontSize: "16px",
            }}
          >
            Nếu bạn muốn mua sản phẩm, bạn phải mua Token từ <br />
            Website của chúng tôi!
          </span>
        </Tag>
        <Form
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          layout="horizontal"
          size="large"
          style={{ padding: "10px", height: "300px" }}
        >
          <p
            className="user-payment-desc"
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#aeaeae",
            }}
          >
            Chi tiết Token
          </p>
          <Form.Item
            style={{
              marginBottom: "16px",
              fontSize: "16px",
            }}
            label="Địa chỉ ví của bạn"
          >
            <Input value={user.addressWallet} />
          </Form.Item>
          <Form.Item style={{ marginBottom: "16px" }} label="Token hiện có">
            <span
              className=""
              style={{
                fontSize: "22px",
                fontWeight: 600,
                color: "#333",
                fontFamily: "cursive",
              }}
            >
              {userTokens} ={" "}
              {numberWithCommas(userTokens * process.env.REACT_APP_TOKEN_PRICE)}
              đ
            </span>
          </Form.Item>
          <p
            className="user-payment-desc"
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#aeaeae",
            }}
          >
            Bạn muốn mua Token
          </p>
          <Badge.Ribbon
            text="<= 1.000.000"
            color="red"
            style={{
              right: "-8px",
              top: "-10px",
            }}
          >
            <Form.Item label="Sô lượng">
              <Input
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
              />
            </Form.Item>
          </Badge.Ribbon>
        </Form>
      </Modal>
    </div>
  );
}

BuyTokenModal.propTypes = {};

export default BuyTokenModal;
