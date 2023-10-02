import React from "react";
import { Avatar, Card } from "antd";
import Meta from "antd/lib/card/Meta";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  convertPriceToToken,
  getProducts,
  numberWithCommas,
} from "../../../../utils";
import { useSelector } from "react-redux";
import { authSelector } from "../../../../Store/Reducer/authReducer";

const ProductsTopItem = styled.div`
  .ant-card-cover {
    width: 180px;
    display: flex;
    justify-content: center;
    transform: translateX(30px);
    padding: 10px;
    img {
      width: 100%;
    }
  }
`;

function ProductsTop(props) {
  const { products_api } = props;
  const { user } = useSelector(authSelector);
  const name_url = (name) => name.replace(/ /g, "-");

  const renderProductsTop = () =>
    products_api
      ? getProducts(6, products_api.products && products_api.products).map(
          (item, i) => (
            <Link
              to={`/product/${item.category}/${name_url(item.name)}/${
                item._id
              }`}
              key={i}
            >
              <Card
                hoverable
                style={{ width: 247 }}
                cover={<img alt="example" src={item.varation[0].image} />}
              >
                <Meta
                  title={item.name}
                  description={
                    user?.addressWallet ? (
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
                    )
                  }
                />
              </Card>
            </Link>
          )
        )
      : "";
  return (
    <ProductsTopItem>
      <div className="product-max-saler">Top Sản Phẩm Bán Chạy</div>
      {renderProductsTop()}
    </ProductsTopItem>
  );
}

ProductsTop.propTypes = {};

export default ProductsTop;
