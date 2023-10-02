import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import { toast } from "react-toastify";
import Web3 from "web3";

export const getInitContracts = createAsyncThunk(
  "getInitContracts/getInitContractsApiFetch",
  async ({ myTokenSale, myToken, kycContract, marketPlace }) => {
    if (myTokenSale && myToken && kycContract && marketPlace) {
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
      if (!web3) {
        toast.warning("bạn chưa có ví điện tử");
        return;
      }
      const accounts = await web3.eth.requestAccounts();
      const networkID = await web3.eth.net.getId();
      const { abi: myTokenSaleAbi } = myTokenSale;
      const { abi: myTokenAbi } = myToken;
      const { abi: kycAbi } = kycContract;
      const { abi: marketPlaceAbi } = marketPlace;

      if (networkID === +process.env.REACT_APP_NETWORK_ID) {
        try {
          const myTokenAddress = myToken.networks[networkID].address;
          const myTokenSaleAddress = myTokenSale.networks[networkID].address;
          const kycAddress = kycContract.networks[networkID].address;
          const marketPlaceAddress = marketPlace.networks[networkID].address;

          const tokenInstance = new web3.eth.Contract(
            myTokenAbi,
            myTokenAddress
          );

          const marketPlaceInstance = new web3.eth.Contract(
            marketPlaceAbi,
            marketPlaceAddress
          );

          const tokenSaleInstance = new web3.eth.Contract(
            myTokenSaleAbi,
            myTokenSaleAddress
          );
          const kycInstance = new web3.eth.Contract(kycAbi, kycAddress);

          return {
            web3,
            accounts,
            networkID,
            contracts: {
              tokenInstance,
              tokenSaleInstance,
              kycInstance,
              marketPlaceInstance,
            },
            contractAddress: {
              kycAddress,
              myTokenSaleAddress,
              myTokenAddress,
              marketPlaceAddress,
            },
          };
        } catch (err) {
          console.error(err);
        }
      } else {
        toast.warning("Network ID is not correct");
      }
    }
  }
);

export const getMyTokenAmount = createAsyncThunk(
  "getMyTokenAmount/getMyTokenAmountApiFetch",
  async ({ tokenInstance, accounts }) => {
    if (tokenInstance !== undefined) {
      try {
        const userTokens = await tokenInstance.methods
          .balanceOf(accounts[0])
          .call();
        return { userTokens };
      } catch (error) {
        console.log(error);
      }
    }
  }
);

export const handleBuyTokens = createAsyncThunk(
  "handleBuyTokens/handleBuyTokensApiFetch",
  async ({ accounts, web3, tokenAmount, tokenSaleInstance }) => {
    try {
      await tokenSaleInstance.methods.buyTokens(accounts[0]).send({
        from: accounts[0],
        value: web3.utils.toWei(tokenAmount, "wei"),
      });
      message.success("Successfully bought tokens");
    } catch (error) {
      console.log(error);
      message.warn("Failed to buy tokens");
    }
  }
);

export const handleBuyItem = createAsyncThunk(
  "handleBuyItem/handleBuyItemApiFetch",
  async ({
    accounts,
    web3,
    price,
    contracts,
    contractAddress,
    handleCreateOrder,
  }) => {
    if (accounts && web3 && price && contracts && contractAddress) {
      const { marketPlaceInstance, tokenInstance } = contracts;
      const { marketPlaceAddress } = contractAddress;
      try {
        const stakeTokenQuantityWei = web3.utils.toWei(
          price.toString(),
          "ether"
        );
        const priceToWei = web3.utils.toWei(price.toString(), "wei");
        await tokenInstance.methods
          .approve(marketPlaceAddress, stakeTokenQuantityWei)
          .send({
            from: accounts[0],
          });

        await marketPlaceInstance.methods
          .createMarketSale("BHL", price, process.env.REACT_APP_OWNER_ADDRESS)
          .send({
            from: accounts[0],
            value: priceToWei,
          });

        handleCreateOrder();
        message.success("Successfully bought Items");
      } catch (error) {
        console.log(error);
        message.warn("Failed to buy Item");
      }
    } else {
      message.warn("You not have enough wallet address");
    }
  }
);

export const handleCreateProductToDB = createAsyncThunk(
  "handleCreateProductToDB/handleCreateProductToDBApiFetch",
  async ({ web3, price, contracts, accounts, postProduct }) => {
    const { marketPlaceInstance } = contracts;

    try {
      if (web3) {
        let listingPrice = await marketPlaceInstance.methods
          .getListingPrice()
          .call();

        await marketPlaceInstance.methods.createToken("BHL", price).send({
          value: listingPrice,
          from: accounts[0],
        });

        postProduct();
        message.success("Successfully created Items");
      } else {
        toast.warning("Bạn chưa có ví điện tử");
      }
    } catch (error) {
      console.log(error);
      message.error("create product failed");
    }
  }
);

const ethSlice = createSlice({
  name: "ether", // ten cua action
  initialState: {
    artifact: null,
    web3: null,
    accounts: null,
    networkID: null,
    contracts: null,
    contractAddress: null,
    userTokens: 0,
  }, // gia tri ban dau cua state
  reducers: {
    initCallAbi(state, action) {
      const { data } = action.payload;
      return { ...state, ...data };
    },
  },
  extraReducers: {
    //fetch activation email
    [getInitContracts.pending]: (state, action) => {},
    [getInitContracts.fulfilled]: (state, action) => {
      if (action.payload) {
        return { ...state, ...action.payload };
      } else {
        message.error("Bạn chưa có tài khoản của ví Metamask");
      }
    },
    [getInitContracts.rejected]: (state, action) => {},

    //fetch activation email
    [getMyTokenAmount.pending]: (state, action) => {},
    [getMyTokenAmount.fulfilled]: (state, action) => {
      return { ...state, ...action.payload };
    },
    [getMyTokenAmount.rejected]: (state, action) => {},
  },
});

const ethReducer = ethSlice.reducer;

export const ethSelector = (state) => state.ethReducer;

export const { initCallAbi } = ethSlice.actions;

export default ethReducer;
