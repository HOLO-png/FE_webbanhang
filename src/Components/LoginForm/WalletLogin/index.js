/* eslint-disable react/jsx-no-target-blank */
import React, { useState } from "react";
import { Avatar, Button, List, Modal } from "antd";
import Icon from "@ant-design/icons";
import { metaMaskLink } from "../../../assets/fake-data";
import { useDispatch, useSelector } from "react-redux";
import { setLoadingAction } from "../../../Store/Reducer/loadingReducer";
import { loginSocialAction } from "../../../Store/Reducer/authReducer";
import { ethSelector } from "../../../Store/Reducer/ethReducer";
import { toast } from "react-toastify";

function WalletLoginConnect(props) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { accounts, contracts, contractAddress, web3 } =
    useSelector(ethSelector);

  const connectWalletHandler = async () => {
    if (web3) {
      if (contracts && accounts && contractAddress?.kycAddress) {
        if (accounts[0]) {
          dispatch(setLoadingAction(true));
          try {
            await contracts.kycInstance.methods
              .setKycCompleted(accounts[0])
              .send({ from: accounts[0] });
            const body = {
              name: "Unnamed",
              email: `${accounts[0]}-email`,
              phoneNumber: "unPhone",
              loginDomain: "cryptoWallet",
              userID: accounts[0],
              addressWallet: accounts[0],
            };
            dispatch(
              loginSocialAction({
                domant: "wallet",
                data: body,
              })
            );
          } catch (error) {
            console.log(error);
          }
          dispatch(setLoadingAction(false));
        }
      }
    } else {
      toast.error("Bạn chưa có ví điện tử");
    }
  };

  const wallets = [
    {
      title: "Login by MetaMask wallet",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png",
      url: metaMaskLink,
      doGetWallet: connectWalletHandler,
    },
  ];

  return (
    <div className="wallet-login-opt" style={{ margin: "15px" }}>
      <Button
        className="wallet-btn"
        ghost
        onClick={() => setIsOpen(true)}
        style={{
          color: "#333",
          width: "100%",
          height: "100%",
          borderRadius: "5px",
        }}
      >
        <Icon
          component={() => (
            <img
              src="https://1000logos.net/wp-content/uploads/2022/05/WalletConnect-Logo.png"
              alt=""
              width={30}
            />
          )}
        />{" "}
        Login With Wallet
      </Button>
      <Modal
        title="Please select wallet to login"
        visible={isOpen}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={wallets}
          className="list-wallet"
          renderItem={(item, idx) => (
            <List.Item
              key={idx}
              actions={[
                <a href={item.url} target="_blank">
                  see more
                </a>,
              ]}
              onClick={item.doGetWallet}
              className="list-wallet-item"
            >
              <List.Item.Meta
                avatar={<Avatar src={item.img} />}
                title={item.title}
                className="list-wallet-item-meta"
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
}

WalletLoginConnect.propTypes = {};

export default WalletLoginConnect;
