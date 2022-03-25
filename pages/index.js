import Head from "next/head";
import { useMoralis, useNFTBalances } from "react-moralis";
import { useEffect, useState } from "react";
import { Button, Grid, Skeleton, Typography } from "@mui/material";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import Footer from "../components/Footer/Footer";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTheme } from "@mui/system";
import { Twitter, YouTube } from "@mui/icons-material";

const CONTRACT_ADDRESSES = {
  pond: "0x85e66216fB0e80F87b54eb39a415c3bbD40E37f9",
  stream: "0x780feb71117157a039e682668d79584d18579e90",
  swamp: "0xec7e923e7e0bd2dc7bb2ac0fabccf4e650c5418c",
  river: "0x4eef52b71bd64d54d736cf2f3073e6dbbfcc7e31",
  forest: "0xcd32ed513a86484688cd3dbada05a9ed3c0c0eb6",
  lake: "0x1009cba3c0a50a2a0e8a92bc070ac5ffb8a3efe2",
  breeding: "0x16d5791f7c31d7e13dd7b18ae2011764c4da8fbc",
  market: "0xbbF9287aFbf1CdBf9f7786E98fC6CEa73A78B6aB",
};

export default function Home() {
  const { getNFTBalances: getPond, data: pond } = useNFTBalances({
    address: CONTRACT_ADDRESSES.pond,
    chain: "avalanche",
  });

  const [everything, setEverything] = useState([]);

  const { isInitialized } = useMoralis();

  const [fetched, setFetched] = useState(false);

  const [total, setTotal] = useState(0);

  const { getNFTBalances: getStream, data: stream } = useNFTBalances({
    address: CONTRACT_ADDRESSES.stream,
    chain: "avalanche",
  });
  const { getNFTBalances: getSwamp, data: swamp } = useNFTBalances({
    address: CONTRACT_ADDRESSES.swamp,
    chain: "avalanche",
  });
  const { getNFTBalances: getRiver, data: river } = useNFTBalances({
    address: CONTRACT_ADDRESSES.river,
    chain: "avalanche",
  });
  const { getNFTBalances: getForest, data: forest } = useNFTBalances({
    address: CONTRACT_ADDRESSES.forest,
    chain: "avalanche",
  });
  const { getNFTBalances: getLake, data: lake } = useNFTBalances({
    address: CONTRACT_ADDRESSES.lake,
    chain: "avalanche",
  });
  const { getNFTBalances: getBreeding, data: breeding } = useNFTBalances({
    address: CONTRACT_ADDRESSES.breeding,
    chain: "avalanche",
  });
  const { getNFTBalances: getMarket, data: market } = useNFTBalances({
    address: CONTRACT_ADDRESSES.market,
    chain: "avalanche",
  });

  const fetchAll = () => {
    console.log("fetching");
    getPond().then((result) => {
      if (result)
        setEverything((prev) => {
          return [...prev, { data: result, name: "Pond" }];
        });
      getStream().then((result) => {
        if (result)
          setEverything((prev) => {
            return [...prev, { data: result, name: "Stream" }];
          });
        getSwamp().then((result) => {
          if (result)
            setEverything((prev) => {
              return [...prev, { data: result, name: "Swamp" }];
            });
          getRiver().then((result) => {
            if (result)
              setEverything((prev) => {
                return [...prev, { data: result, name: "River" }];
              });
            getForest().then((result) => {
              if (result)
                setEverything((prev) => {
                  return [...prev, { data: result, name: "Forest" }];
                });
              getLake().then((result) => {
                if (result)
                  setEverything((prev) => {
                    return [...prev, { data: result, name: "Great Lake" }];
                  });
                getBreeding().then((result) => {
                  if (result)
                    setEverything((prev) => {
                      return [...prev, { data: result, name: "Breeding" }];
                    });
                  getMarket().then((result) => {
                    if (result)
                      setEverything((prev) => {
                        return [...prev, { data: result, name: "Market" }];
                      });
                  });
                });
              });
            });
          });
        });
      });
    });
  };

  useEffect(() => {
    if (isInitialized && everything.length === 0) fetchAll();
  }, [isInitialized]);

  if (everything.length === 8 && !fetched) {
    setFetched(true);

    let tempTotal =
      pond.total +
      stream.total +
      swamp.total +
      river.total +
      forest.total +
      lake.total +
      breeding.total +
      market.total;

    let wasted = 10000 - tempTotal;

    setTotal(tempTotal);
    setEverything((prev) => {
      return [...prev, { data: { total: wasted }, name: "Idle" }];
    });
  }

  function format(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const theme = useTheme();

  return (
    <>
      <div className={styles.main}>
        <Head>
          <title>Where The Hoppers At</title>
          <meta
            name="description"
            content="An unofficial Hoppers NFT Adventures distribution."
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h4" textAlign={"center"} fontWeight={"bolder"}>
              Where Are All The Hoppers???
            </Typography>
            <Grid container justifyContent={"center"} spacing={2}>
              <Grid item>
                <Image
                  alt="frog in a pond"
                  src={"/frog-in-a-pond-vector.webp"}
                  width={"1200"}
                  height={"507"}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent={"center"}>
              <Grid item xs={12} md={10} lg={8} xl={6}>
                <Typography variant={"h5"} textAlign="center">
                  We all want to know where every Hopper is, and what adventures
                  have the highest numbers of Hoppers. Well, now you can always
                  tell.
                </Typography>
                <Typography variant={"h5"} textAlign="center">
                  Made with ❤️ for the Hoppers Community.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <br />
          <Grid item xs={12} md={10} lg={8} xl={6}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Adventure</th>
                  <th>Number of Hoppers</th>
                </tr>
              </thead>
              <tbody style={{ color: theme.palette.primary.main }}>
                {fetched ? (
                  everything
                    .sort((a, b) => b.data.total - a.data.total)
                    .map((adventure, key) => {
                      return (
                        <tr key={key}>
                          <td>{key + 1}</td>
                          <td>{adventure.name}</td>
                          <td>{format(adventure.data.total)}</td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td>
                      <Skeleton />
                    </td>
                    <td>
                      <Skeleton />
                    </td>
                    <td>
                      <Skeleton />
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <th></th>
                  <th>Total Supply</th>
                  <th>10,000</th>
                </tr>
              </tfoot>
            </table>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="center">
              <Button
                startIcon={<RefreshIcon />}
                variant="contained"
                color="primary"
                onClick={() => {
                  setEverything([]);
                  setFetched(false);
                  fetchAll();
                }}
                size="small"
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12} md={10} lg={8} xl={6}>
            <Typography variant={"h6"} textAlign="center">
              This website was born out of my own research into the game
              mechanics and trying to find an easy way to see the different
              adventure distributions.
            </Typography>
            <Typography variant={"h6"} textAlign="center">
              Depending on interest from the community, I may add more
              functionality down the line. You can contact me on Twitter to make
              requests.
            </Typography>
            <Typography variant={"h6"} textAlign="center">
              If you{`&apos`}re feeling generous, you can donate some 🪰 $FLY to
              my wallet address.
            </Typography>
            <Typography variant={"subtitle2"} textAlign="center">
              0xD57F9b9a157B9D14feD8F21417E2dd5A49089114
            </Typography>
            <Grid container justifyContent={"center"} spacing={2}>
              <Grid item>
                <a href="https://twitter.com/darlingTdaniel">
                  <Twitter />
                </a>
              </Grid>
              <Grid item>
                <a href="https://www.youtube.com/channel/UCvtV2e-cpATdPdwh5RnyOXQ">
                  <YouTube />
                </a>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <Footer>
        <Typography variant="subtitle2">
          <a href="https://www.vecteezy.com/free-vector/frog-pond">
            Frog Pond Vectors by Vecteezy
          </a>
        </Typography>
      </Footer>
    </>
  );
}
