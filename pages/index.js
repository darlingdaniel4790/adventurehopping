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
import { logEvent } from "firebase/analytics";
import { createClient } from "urql";

const APIURL =
  "https://api.thegraph.com/subgraphs/name/darlingdaniel4790/hoppers-game";

// const CONTRACT_ADDRESSES = {
//   pond: "0x85e66216fb0e80f87b54eb39a415c3bbd40e37f9",
//   stream: "0x780feb71117157a039e682668d79584d18579e90",
//   swamp: "0xec7e923e7e0bd2dc7bb2ac0fabccf4e650c5418c",
//   river: "0x4eef52b71bd64d54d736cf2f3073e6dbbfcc7e31",
//   forest: "0xcd32ed513a86484688cd3dbada05a9ed3c0c0eb6",
//   lake: "0x1009cba3c0a50a2a0e8a92bc070ac5ffb8a3efe2",
//   breeding: "0x16d5791f7c31d7e13dd7b18ae2011764c4da8fbc",
//   market: "0xbbf9287afbf1cdbf9f7786e98fc6cea73a78b6ab",
// };
const ADDRESSES = [
  { address: "0x85e66216fb0e80f87b54eb39a415c3bbd40e37f9", name: "Pond" },
  { address: "0x780feb71117157a039e682668d79584d18579e90", name: "Stream" },
  { address: "0xec7e923e7e0bd2dc7bb2ac0fabccf4e650c5418c", name: "Swamp" },
  { address: "0x4eef52b71bd64d54d736cf2f3073e6dbbfcc7e31", name: "River" },
  { address: "0xcd32ed513a86484688cd3dbada05a9ed3c0c0eb6", name: "Forest" },
  { address: "0x1009cba3c0a50a2a0e8a92bc070ac5ffb8a3efe2", name: "Lake" },
  { address: "0x16d5791f7c31d7e13dd7b18ae2011764c4da8fbc", name: "Breeding" },
  { address: "0xbbf9287afbf1cdbf9f7786e98fc6cea73a78b6ab", name: "Market" },
];
const appVersion = 1.2;

export default function Home(props) {
  const [everything, setEverything] = useState([]);

  // const { isInitialized } = useMoralis();

  const [fetched, setFetched] = useState(false);

  // const { getNFTBalances: getPond, data: pond } = useNFTBalances({
  //   address: CONTRACT_ADDRESSES.pond,
  //   chain: "avalanche",
  // });

  const client = createClient({
    url: APIURL,
  });

  const [players, setPlayers] = useState([]);

  const [hoppers, setHoppers] = useState([]);

  const count = () => {
    const playersTemp = [],
      everythingTemp = [];
    hoppers.forEach((hopper) => {
      // set adventures
      const res = everythingTemp.findIndex((token) => {
        return token.name === hopper.location;
      });
      if (res !== -1) {
        everythingTemp[res].data.total++;
      } else {
        everythingTemp.push({
          data: { total: 1 },
          name: hopper.location,
        });
      }

      // set players
      const index = playersTemp.findIndex((player) => {
        return player.address === hopper.owner;
      });
      if (index !== -1) {
        playersTemp[index].totalOwned++;
        playersTemp[index].hoppers.push({
          token_id: hopper.token_id,
          location: hopper.location,
        });
      } else {
        playersTemp.push({
          address: hopper.owner,
          totalOwned: 1,
          hoppers: [
            {
              token_id: hopper.token_id,
              location: hopper.location,
            },
          ],
        });
      }
    });
    let holder = [];
    everythingTemp.forEach((item) => {
      ADDRESSES.forEach((address) => {
        if (item.name === address.address) {
          holder.push({ ...item, name: address.name });
        }
      });
    });
    // console.log(everythingTemp.length, holder);
    setPlayers(playersTemp);
    setEverything(holder);
  };

  useEffect(() => {
    if (hoppers.length === 10000) {
      count();
    }

    return () => {};
  }, [hoppers]);

  // if (players != [])
  //   console.log(
  //     players.sort((a, b) => {
  //       return b.totalOwned - a.totalOwned;
  //     })
  //   );

  const fetchLead = () => {
    for (let i = 0; i < 10; i++) {
      const tokensQuery = `
    query( $lastID: Int!) {
      hoppers (orderBy:token_id,first:1000, where:{token_id_gte: $lastID}) {
        token_id
        owner
        location
      }
    }
  `;
      client
        .query(tokensQuery, { lastID: i * 1000 })
        .toPromise()
        .then((data) => {
          setFetched(true);
          setHoppers((prev) => {
            return [...prev, ...data.data.hoppers];
          });
        })
        .catch((err) => {
          console.log("Error fetching data: ", err);
        });
    }
  };

  useEffect(() => {
    fetchLead();
  }, []);

  // const {
  //   getNFTBalances: getStream,
  //   data: stream,
  //   isFetching: streamIsFetching,
  //   isLoading: streamIsLoading,
  // } = useNFTBalances({
  //   address: CONTRACT_ADDRESSES.stream,
  //   chain: "avalanche",
  // });
  // const {
  //   getNFTBalances: getSwamp,
  //   data: swamp,
  //   isFetching: swampIsFetching,
  //   isLoading: swampIsLoading,
  // } = useNFTBalances({
  //   address: CONTRACT_ADDRESSES.swamp,
  //   chain: "avalanche",
  // });
  // const {
  //   getNFTBalances: getRiver,
  //   data: river,
  //   isFetching: riverIsFetching,
  //   isLoading: riverIsLoading,
  // } = useNFTBalances({
  //   address: CONTRACT_ADDRESSES.river,
  //   chain: "avalanche",
  // });
  // const {
  //   getNFTBalances: getForest,
  //   data: forest,
  //   isFetching: forestIsFetching,
  //   isLoading: forestIsLoading,
  // } = useNFTBalances({
  //   address: CONTRACT_ADDRESSES.forest,
  //   chain: "avalanche",
  // });
  // const {
  //   getNFTBalances: getLake,
  //   data: lake,
  //   isFetching: lakeIsFetching,
  //   isLoading: lakeIsLoading,
  // } = useNFTBalances({
  //   address: CONTRACT_ADDRESSES.lake,
  //   chain: "avalanche",
  // });
  // const {
  //   getNFTBalances: getBreeding,
  //   data: breeding,
  //   isFetching: breedingIsFetching,
  //   isLoading: breedingIsLoading,
  // } = useNFTBalances({
  //   address: CONTRACT_ADDRESSES.breeding,
  //   chain: "avalanche",
  // });
  // const {
  //   getNFTBalances: getMarket,
  //   data: market,
  //   isFetching: marketIsFetching,
  //   isLoading: marketIsLoading,
  // } = useNFTBalances({
  //   address: CONTRACT_ADDRESSES.market,
  //   chain: "avalanche",
  // });

  // const disableButton =
  //   streamIsFetching ||
  //   swampIsFetching ||
  //   riverIsFetching ||
  //   forestIsFetching ||
  //   lakeIsFetching ||
  //   breedingIsFetching ||
  //   marketIsFetching;

  // const fetchAll = () => {
  //   console.log("fetching");
  //   getPond().then((result) => {
  //     if (result)
  //       setEverything((prev) => {
  //         return [...prev, { data: result, name: "Pond" }];
  //       });
  //     getStream().then((result) => {
  //       if (result)
  //         setEverything((prev) => {
  //           return [...prev, { data: result, name: "Stream" }];
  //         });
  //       getSwamp().then((result) => {
  //         if (result)
  //           setEverything((prev) => {
  //             return [...prev, { data: result, name: "Swamp" }];
  //           });
  //         getRiver().then((result) => {
  //           if (result)
  //             setEverything((prev) => {
  //               return [...prev, { data: result, name: "River" }];
  //             });
  //           getForest().then((result) => {
  //             if (result)
  //               setEverything((prev) => {
  //                 return [...prev, { data: result, name: "Forest" }];
  //               });
  //             getLake().then((result) => {
  //               if (result)
  //                 setEverything((prev) => {
  //                   return [...prev, { data: result, name: "Great Lake" }];
  //                 });
  //               getBreeding().then((result) => {
  //                 if (result)
  //                   setEverything((prev) => {
  //                     return [...prev, { data: result, name: "Breeding" }];
  //                   });
  //                 getMarket().then((result) => {
  //                   if (result)
  //                     setEverything((prev) => {
  //                       return [...prev, { data: result, name: "Market" }];
  //                     });
  //                 });
  //               });
  //             });
  //           });
  //         });
  //       });
  //     });
  //   });
  // };

  // useEffect(() => {
  //   if (isInitialized && everything.length === 0) fetchAll();
  // }, [isInitialized]);

  // const result = stream.result.find((a) => a.token_id === "1872");
  // console.log(pond);

  if (everything.length === 8 && !fetched) {
    setFetched(true);

    let tempTotal = 0;
    everything.forEach((item) => {
      tempTotal += item.data.total;
    });

    let wasted = 10000 - tempTotal;

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
                <Typography variant={"h5"} textAlign="center" gutterBottom>
                  Made with ❤️ for the Hoppers Community.
                </Typography>
                <Typography
                  variant={"h4"}
                  textAlign="center"
                  fontFamily={"'Press Start 2P'"}
                >
                  Player Count:{" "}
                  {players.length !== 0 ? (
                    <span style={{ color: "red" }}>{players.length}</span>
                  ) : (
                    <Skeleton />
                  )}
                </Typography>
                <Typography
                  variant={"subtitle2"}
                  textAlign="center"
                  color={"blueviolet"}
                >
                  The unique wallet count is used to calculate this.
                  <br />
                  Of course players may have multiple wallets.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <br />
          <br />
          <br />
          <Grid item xs={12} md={10} lg={8} xl={7}>
            <Typography variant={"h3"} textAlign="center" gutterBottom>
              Distribution{" "}
              <Button
                // disabled={disableButton}
                startIcon={<RefreshIcon />}
                variant="contained"
                color="primary"
                onClick={() => {
                  if (props.analytics != undefined) {
                    logEvent(
                      props.analytics,
                      "distribution_refresh_button_clicked"
                    );
                  }
                  setEverything([]);
                  setFetched(false);
                  setHoppers([]);
                  fetchLead();
                }}
                size="small"
              >
                Refresh
              </Button>
            </Typography>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Adventure</th>
                  <th>Number of Hoppers</th>
                </tr>
              </thead>
              <tbody style={{ color: theme.palette.primary.main }}>
                {everything.length !== 0 ? (
                  everything
                    .sort((a, b) => b.data.total - a.data.total)
                    .map((adventure, key) => {
                      let icon, style;
                      switch (key) {
                        case 0:
                          icon = "🥇";
                          style = "xx-large";
                          break;
                        case 1:
                          icon = "🥈";
                          style = "xx-large";
                          break;
                        case 2:
                          icon = "🥉";
                          style = "xx-large";
                          break;

                        default:
                          icon = key + 1;
                          break;
                      }
                      return (
                        <tr key={key} style={{ fontSize: style }}>
                          <td>{icon}</td>
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
          <Grid
            item
            xs={12}
            md={10}
            lg={8}
            xl={7}
            style={{ paddingTop: "5rem" }}
          >
            <Typography variant={"h3"} textAlign="center" gutterBottom>
              Leaderboard{" "}
              <Button
                // disabled={disableButton}
                startIcon={<RefreshIcon />}
                variant="contained"
                color="primary"
                onClick={() => {
                  if (props.analytics != undefined) {
                    logEvent(
                      props.analytics,
                      "leaderboard_refresh_button_clicked"
                    );
                  }
                  setPlayers([]);
                  setHoppers([]);
                  setFetched(false);
                  fetchLead();
                }}
                size="small"
              >
                Refresh
              </Button>
            </Typography>
            <table style={{ overflowWrap: "anywhere" }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Address</th>
                  <th>Number of Hoppers</th>
                </tr>
              </thead>
              <tbody style={{ color: theme.palette.primary.main }}>
                {players.length !== 0 ? (
                  players
                    .sort((a, b) => b.totalOwned - a.totalOwned)
                    .map((player, key) => {
                      let icon, style;
                      switch (key) {
                        case 0:
                          icon = "🥇";
                          // style = "xx-large";
                          break;
                        case 1:
                          icon = "🥈";
                          // style = "xx-large";
                          break;
                        case 2:
                          icon = "🥉";
                          // style = "xx-large";
                          break;

                        default:
                          icon = key + 1;
                          break;
                      }
                      return (
                        <tr
                          key={key}
                          style={
                            {
                              // fontSize: style
                            }
                          }
                        >
                          <td>{icon}</td>
                          <td>{player.address}</td>
                          <td>{format(player.totalOwned)}</td>
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
            </table>
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
              If you&apos;re feeling generous, you can donate some 🪰 $FLY to my
              wallet address.
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
        <Typography variant="subtitle2">App Version: {appVersion}</Typography>
        <Typography variant="subtitle2">
          <a href="https://www.vecteezy.com/free-vector/frog-pond">
            Frog Pond Vectors by Vecteezy
          </a>
        </Typography>
      </Footer>
    </>
  );
}
