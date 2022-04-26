import Head from "next/head";
import { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import Footer from "../components/Footer/Footer";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTheme } from "@mui/system";
import { AcUnit, Twitter, Visibility, YouTube } from "@mui/icons-material";
import { logEvent } from "firebase/analytics";
import { createClient } from "urql";
import Pagination from "@mui/material/Pagination";

const APIURL =
  "https://api.thegraph.com/subgraphs/name/darlingdaniel4790/hoppers-game";

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
const appVersion = 1.3;

export default function Home(props) {
  const [everything, setEverything] = useState([]);

  const [fetched, setFetched] = useState(false);

  const client = createClient({
    url: APIURL,
  });

  const [players, setPlayers] = useState([]);
  const [tadpolePlayers, setTadpolePlayers] = useState([]);

  const [leaderboard, setLeaderboard] = useState();
  const [leaderboardTad, setLeaderboardTad] = useState();

  const [hoppers, setHoppers] = useState([]);
  const [tadpoles, setTadpoles] = useState([]);

  const count = () => {
    const playersTemp = [],
      tadpoleOwners = [],
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

    tadpoles.forEach((tadpole) => {
      // // set adventures
      // const res = everythingTemp.findIndex((token) => {
      //   return token.name === tadpole.location;
      // });
      // if (res !== -1) {
      //   everythingTemp[res].data.total++;
      // } else {
      //   everythingTemp.push({
      //     data: { total: 1 },
      //     name: tadpole.location,
      //   });
      // }

      // set players
      const index = tadpoleOwners.findIndex((player) => {
        return player.address === tadpole.owner;
      });
      if (index !== -1) {
        tadpoleOwners[index].totalOwned++;
        tadpoleOwners[index].tadpoles.push({
          token_id: tadpole.token_id,
          location: tadpole.location,
        });
      } else {
        tadpoleOwners.push({
          address: tadpole.owner,
          totalOwned: 1,
          tadpoles: [
            {
              token_id: tadpole.token_id,
              location: tadpole.location,
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

    setTadpolePlayers(tadpoleOwners);
    setPlayers(playersTemp);
    setEverything(holder);
    setLeaderboard(
      playersTemp
        .sort((a, b) => b.totalOwned - a.totalOwned)
        .map((player, key) => {
          let icon,
            url1 = "https://snowtrace.io/address/" + player.address,
            url2 = "https://hoppershopper.xyz/wallet?wallet=" + player.address;
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
              <td>
                {player.address}
                <a
                  href={url1}
                  target="_blank"
                  rel="noreferrer"
                  style={{ margin: "5px" }}
                >
                  <Tooltip title="View on Snowtrace">
                    <AcUnit fontSize="5px" />
                  </Tooltip>
                </a>
                <a
                  href={url2}
                  target="_blank"
                  rel="noreferrer"
                  style={{ margin: "5px" }}
                >
                  <Tooltip title="View on Hopper Shopper">
                    <Visibility fontSize="5px" />
                  </Tooltip>
                </a>
              </td>
              <td>{format(player.totalOwned)}</td>
            </tr>
          );
        })
    );
    setLeaderboardTad(
      tadpoleOwners
        .sort((a, b) => b.totalOwned - a.totalOwned)
        .map((player, key) => {
          let icon,
            url1 = "https://snowtrace.io/address/" + player.address,
            url2 = "https://hoppershopper.xyz/wallet?wallet=" + player.address;
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
              <td>
                {player.address}
                <a
                  href={url1}
                  target="_blank"
                  rel="noreferrer"
                  style={{ margin: "5px" }}
                >
                  <Tooltip title="View on Snowtrace">
                    <AcUnit fontSize="5px" />
                  </Tooltip>
                </a>
                <a
                  href={url2}
                  target="_blank"
                  rel="noreferrer"
                  style={{ margin: "5px" }}
                >
                  <Tooltip title="View on Hopper Shopper">
                    <Visibility fontSize="5px" />
                  </Tooltip>
                </a>
              </td>
              <td>{format(player.totalOwned)}</td>
            </tr>
          );
        })
    );
  };

  useEffect(() => {
    if (hoppers.length === 10000 && tadpoles) {
      count();
    }

    return () => {};
  }, [hoppers, tadpoles]);

  const fetchLead = () => {
    for (let i = 0; i < 10; i++) {
      const tokensQuery = `
    query( $lastID: Int!) {
      hoppers (orderBy:token_id,first:1000, where:{token_id_gte: $lastID}) {
        token_id
        owner
        location
      }
      tadpoles (orderBy:token_id,first:1000, where:{token_id_gte: $lastID}) {
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
          setTadpoles((prev) => {
            return [...prev, ...data.data.tadpoles];
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

  // hoppers section
  const itemsPerPage = 20;
  const [page, setPage] = useState(1);
  const [output, setOutput] = useState();
  const [searchValue, setSearchValue] = useState();

  useEffect(() => {
    if (searchValue) {
      let result = players.findIndex((player) => {
        return player.address == searchValue;
      });
      if (result === -1) setOutput("Address not found.");
      else {
        setOutput([leaderboard[result]]);
        setPage(Math.ceil((result + 1) / itemsPerPage));
      }
    } else if (leaderboard) {
      setOutput(() => {
        let temp = [];
        let offset =
          page === 0
            ? (page - 1) * (itemsPerPage + 1)
            : (page - 1) * itemsPerPage;
        // let tempOffset = offset === 0 ? offset : offset - 1;
        for (let i = offset; i < offset + itemsPerPage; i++) {
          temp.push(leaderboard[i]);
        }
        return temp;
      });
    }
  }, [leaderboard, page, searchValue]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value.toLowerCase());
  };
  // section end

  // tadpole section
  const itemsPerPageTad = 20;
  const [pageTad, setPageTad] = useState(1);
  const [outputTad, setOutputTad] = useState();
  const [searchValueTad, setSearchValueTad] = useState();

  useEffect(() => {
    if (searchValueTad) {
      let result = tadpolePlayers.findIndex((player) => {
        return player.address == searchValueTad;
      });
      if (result === -1) setOutputTad("Address not found.");
      else {
        setOutputTad([leaderboardTad[result]]);
        setPageTad(Math.ceil((result + 1) / itemsPerPageTad));
      }
    } else if (leaderboardTad) {
      setOutputTad(() => {
        let temp = [];
        let offset =
          pageTad === 0
            ? (pageTad - 1) * (itemsPerPageTad + 1)
            : (pageTad - 1) * itemsPerPageTad;
        // let tempOffset = offset === 0 ? offset : offset - 1;
        for (let i = offset; i < offset + itemsPerPageTad; i++) {
          temp.push(leaderboardTad[i]);
        }
        return temp;
      });
    }
  }, [leaderboardTad, pageTad, searchValueTad]);

  const handleChangeTad = (event, value) => {
    setPageTad(value);
  };

  const handleSearchTad = (e) => {
    setSearchValueTad(e.target.value.toLowerCase());
  };
  // section end

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
                  Hopper Owners Count:{" "}
                  {players.length !== 0 ? (
                    <span style={{ color: "red" }}>{players.length}</span>
                  ) : (
                    <Skeleton />
                  )}
                </Typography>
                <br />
                <Typography
                  variant={"h4"}
                  textAlign="center"
                  fontFamily={"'Press Start 2P'"}
                >
                  Tadpole Owners Count:{" "}
                  {tadpolePlayers.length !== 0 ? (
                    <span style={{ color: "red" }}>
                      {tadpolePlayers.length}
                    </span>
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
            <Typography variant={"h3"} textAlign="center">
              Hopper Distribution
            </Typography>
            <Grid
              container
              justifyContent={"center"}
              style={{ paddingBottom: "1rem" }}
            >
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
            </Grid>
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
            style={{ paddingTop: "3rem" }}
          >
            <Typography variant={"h3"} textAlign="center">
              Hopper Leaderboard
            </Typography>
            <Grid container justifyContent={"center"}>
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
                  setTadpoles([]);
                  setFetched(false);
                  fetchLead();
                  setOutput();
                }}
                size="small"
              >
                Refresh
              </Button>
            </Grid>
            <TextField
              id="filled-search"
              label="Find Address"
              type="search"
              variant="filled"
              fullWidth
              style={{ marginTop: "1rem" }}
              onChange={handleSearch}
            />
            <Grid
              container
              direction={"column"}
              alignItems="center"
              style={{ paddingBottom: "1rem", paddingTop: "1rem" }}
            >
              <Grid item>
                <Pagination
                  count={
                    players.length != 0
                      ? Math.ceil(players.length / itemsPerPage)
                      : 0
                  }
                  page={page}
                  onChange={handleChange}
                  // boundaryCount={2}
                  // siblingCount={0}
                />
              </Grid>
            </Grid>
            <table style={{ overflowWrap: "anywhere" }}>
              <thead>
                <tr>
                  <th style={{ minWidth: "3.5rem" }}>#</th>
                  <th>Address</th>
                  <th>Number of Hoppers</th>
                </tr>
              </thead>
              <tbody style={{ color: theme.palette.primary.main }}>
                {output ? (
                  output
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
            <Grid
              container
              direction={"column"}
              alignItems="center"
              style={{ paddingTop: "1rem" }}
            >
              <Grid item>
                <Pagination
                  count={
                    players.length != 0
                      ? Math.ceil(players.length / itemsPerPage)
                      : 0
                  }
                  page={page}
                  onChange={handleChange}
                  // boundaryCount={2}
                  // siblingCount={0}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            md={10}
            lg={8}
            xl={7}
            style={{ paddingTop: "3rem", paddingBottom: "3rem" }}
          >
            <Typography variant={"h3"} textAlign="center">
              Tadpole Leaderboard
            </Typography>
            <Grid container justifyContent={"center"}>
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
                  setTadpolePlayers([]);
                  setTadpoles([]);
                  setHoppers([]);
                  setFetched(false);
                  fetchLead();
                  setOutputTad();
                }}
                size="small"
              >
                Refresh
              </Button>
            </Grid>
            <TextField
              id="filled-search"
              label="Find Address"
              type="search"
              variant="filled"
              fullWidth
              style={{ marginTop: "1rem" }}
              onChange={handleSearchTad}
            />
            <Grid
              container
              direction={"column"}
              alignItems="center"
              style={{ paddingBottom: "1rem", paddingTop: "1rem" }}
            >
              <Grid item>
                <Pagination
                  count={
                    tadpolePlayers.length != 0
                      ? Math.ceil(tadpolePlayers.length / itemsPerPageTad)
                      : 0
                  }
                  page={pageTad}
                  onChange={handleChangeTad}
                  // boundaryCount={2}
                  // siblingCount={0}
                />
              </Grid>
            </Grid>
            <table style={{ overflowWrap: "anywhere" }}>
              <thead>
                <tr>
                  <th style={{ minWidth: "3.5rem" }}>#</th>
                  <th>Address</th>
                  <th>Number of Tadpoles</th>
                </tr>
              </thead>
              <tbody style={{ color: theme.palette.primary.main }}>
                {outputTad ? (
                  outputTad
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
            <Grid
              container
              direction={"column"}
              alignItems="center"
              style={{ paddingTop: "1rem" }}
            >
              <Grid item>
                <Pagination
                  count={
                    tadpolePlayers.length != 0
                      ? Math.ceil(tadpolePlayers.length / itemsPerPageTad)
                      : 0
                  }
                  page={pageTad}
                  onChange={handleChangeTad}
                  // boundaryCount={2}
                  // siblingCount={0}
                />
              </Grid>
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
