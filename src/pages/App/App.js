import { BrowserRouter, Switch } from "react-router-dom";
import { useEffect, useState } from "react";
import { DASHBOARD_MAIN, LOGIN_ROUTES, MAIN_ROUTES } from "../../constans";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../../Common/Layout";
import { useHistory } from "react-router";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import LoginLayout from "../../Common/LoginLayout";
import { useDispatch, useSelector } from "react-redux";
import { VerticalAlignTopOutlined } from "@ant-design/icons";
import {
  addSearchItemUserApi,
  deleteSearchItemUserApi,
  searchItemSelector,
} from "../../Store/Reducer/searchItem";
import DashboardLayout from "../../Common/DashboardLayout";
import UserLeaveConfirmation from "../../Components/UserLeaveConfirmation";
import {
  loadingSelector,
  setLoadingAction,
} from "../../Store/Reducer/loadingReducer";
import ScaleLoader from "react-spinners/ScaleLoader";
import { css } from "styled-components";
import {
  authSelector,
  getUserByToken,
  handleLogout,
  signingSuccess,
} from "../../Store/Reducer/authReducer";
import {
  cartSelector,
  getOrCreateCartToUserApi,
  handleResetCartUser,
} from "../../Store/Reducer/cartReducer";
import axios from "axios";
import jwt_decode from "jwt-decode";
import ScrollToTop from "../../Components/ScrollToTop";
import { BackTop, message, Tooltip } from "antd";
import { getInitContracts } from "../../Store/Reducer/ethReducer";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  transition: display 0.5s ease;
`;

const text = <span>Cuộn lên đầu trang</span>;
const baseURL = process.env.REACT_APP_SERVER_API;

const style = {
  height: 40,
  width: 40,
  lineHeight: "40px",
  borderRadius: 4,
  backgroundColor: "#1088e9",
  color: "#fff",
  textAlign: "center",
  fontSize: 33,
};

const refreshToken = async ({ history }) => {
  try {
    const res = await axios.post(`${baseURL}/auth/refresh_token`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.log(err);
    message.warning("Phiên đăng nhập của bạn đã hết hạn");
    if (history) {
      history.push("/buyer/signin");
    }
  }
};

export const createAxiosJWT = ({ tokenAuth, history, dispatch }) => {
  let axiosJWT = axios.create();
  axios.defaults.withCredentials = true;

  axiosJWT.interceptors.request.use(
    async (config) => {
      let date = new Date();
      if (tokenAuth) {
        const decodeToken = jwt_decode(tokenAuth);
        if (decodeToken.exp < date.getTime() / 1000) {
          const data = await refreshToken({ history });
          dispatch(signingSuccess(data));
          config.headers["Authorization"] = data.access_token;
        }
        return config;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  return axiosJWT;
};

function App() {
  const history = useHistory();
  const searchItem = useSelector(searchItemSelector);
  const loading = useSelector(loadingSelector);
  const auth = useSelector(authSelector);
  const cart = useSelector(cartSelector);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const dispatch = useDispatch();
  const [confirmOpen, setConfirmOpen] = useState(true);
  const axiosJWT = createAxiosJWT({
    tokenAuth: auth.tokenAuth,
    history,
    dispatch,
  });

  useEffect(() => {
    const tryInit = async () => {
      try {
        const myToken = require("../../contracts/MyToken.json");
        const myTokenSale = require("../../contracts/MyTokenSale.json");
        const kycContract = require("../../contracts/KycContract.json");
        const marketPlace = require("../../contracts/Marketplace.json");

        const artifact = { myToken, myTokenSale, kycContract, marketPlace };
        dispatch(getInitContracts(artifact));
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [dispatch, user?.addressWallet]);

  useEffect(() => {
    window.ethereum.on("accountsChanged", function (accounts) {
      console.log(history);
      dispatch(handleResetCartUser());
      dispatch(setLoadingAction(true));
      dispatch(handleLogout(history));
      setTimeout(() => {
        dispatch(setLoadingAction(false));
      }, 500);
    });
  }, [dispatch, history]);

  useEffect(() => {
    if (user && token) {
      setTimeout(() => {
        dispatch(setLoadingAction(false));
      }, 500);
    }
  }, [dispatch, user, token]);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [loading]);

  useEffect(() => {
    if (auth.tokenAuth) {
      dispatch(getOrCreateCartToUserApi({ token: auth.tokenAuth, axiosJWT }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, auth.tokenAuth]);

  useEffect(() => {
    if (auth.tokenAuth) {
      dispatch(getUserByToken({ token: auth.tokenAuth, axiosJWT }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, auth.tokenAuth]);

  const insertSearchItemUser = (data) => {
    dispatch(addSearchItemUserApi(data));
  };
  const removeSearchItem = (id) => {
    dispatch(deleteSearchItemUserApi(id));
  };

  const renderDashboardRoute = () => {
    return DASHBOARD_MAIN.map((route, index) => {
      if (auth.user?.isAdmin) {
        return (
          auth.tokenAuth &&
          auth.user && (
            <DashboardLayout
              name={route.name}
              key={index}
              component={route.component}
              exact={route.exact}
              path={route.path}
              axiosJWT={axiosJWT}
            />
          )
        );
      } else {
        return null;
      }
    });
  };

  const renderAdminRoute = () => {
    return MAIN_ROUTES.map((route, index) => {
      return (
        <Layout
          name={route.name}
          key={index}
          component={route.component}
          exact={route.exact}
          path={route.path}
          axiosJWT={axiosJWT}
        />
      );
    });
  };

  const renderLoginRoute = () => {
    return LOGIN_ROUTES.map((route, index) => {
      return (
        <LoginLayout
          name={route.name}
          key={index}
          component={route.component}
          exact={route.exact}
          path={route.path}
        />
      );
    });
  };

  const renderMain = () => (
    <>
      <div className="container">
        <Header
          searchItem={searchItem}
          insertSearchItemUser={insertSearchItemUser}
          removeSearchItem={removeSearchItem}
          user={auth.user}
          cart={cart}
        />
        <div className="main">
          <Switch>{renderAdminRoute()}</Switch>
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      {loading && (
        <div className="loading__container">
          <ScaleLoader
            color={"#2963B3"}
            loading={loading}
            css={override}
            size={200}
          />
        </div>
      )}

      <BrowserRouter
        getUserConfirmation={(message, callback) => {
          return UserLeaveConfirmation(
            message,
            callback,
            confirmOpen,
            setConfirmOpen
          );
        }}
      >
        <ToastContainer />
        <Tooltip
          placement="top"
          title={text}
          style={{ right: "76px", bottom: "100px" }}
          color="#4267b2"
        >
          <BackTop>
            <div style={style}>
              <VerticalAlignTopOutlined />
            </div>
          </BackTop>
        </Tooltip>
        <ScrollToTop>
          <Switch>
            {renderDashboardRoute()}
            {renderLoginRoute()}
            {renderMain()}
          </Switch>
        </ScrollToTop>
      </BrowserRouter>
    </>
  );
}

export default App;
