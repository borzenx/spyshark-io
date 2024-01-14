import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { Badge, Card, Col, ProgressBar, Row, Tab, Tabs } from "react-bootstrap";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Title, Tooltip, Filler, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

import Loading from "../../components/loading";
import { options } from "./options";
import { TrafficData } from "./interface";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const Store: React.FC = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const name: string | null = queryParams.get("q");
  const sessionToken = localStorage.getItem('sessionToken');

  let isNameInTrackedList = false;

  if (name !== null) {
    const trackedList = localStorage.getItem("trackedStores");

    if (trackedList) {
      const objects: Array<{ storeLink: string }> = JSON.parse(trackedList);
      const storeLinks: string[] = objects.map(
        (obj: { storeLink: string }) => obj.storeLink
      );
      isNameInTrackedList = storeLinks.includes(name);
    }
  }

  const [loading, setLoading] = useState(true);
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);
  const [salesData, setSalesData] = useState<any>(null); // Replace 'any' with the actual type of your sales data
  const [allTimeSalesData, setAllTimeSalesData] = useState<any>(null);
const [last7DaysSalesData, setLast7DaysSalesData] = useState<any>(null);
const [last30DaysSalesData, setLast30DaysSalesData] = useState<any>(null);
const [avgLast30DaysSalesCount, setAvgLast30DaysSalesCount] = useState<number | null>(null);
const [last90DaysSalesData, setLast90DaysSalesData] = useState<any>(null);


  useEffect(() => {
    const fetchTraffic = async () => {
      try {
        if (name) {
          const response = await fetch(
            `https://spyshark-io.azurewebsites.net/api/traffic/${name}`
          );

          if (response.ok) {
            const data = await response.json();
            setTrafficData(data);
          }
        }
      } catch (error) {
        // Handle error if necessary
      }
    };

    const fetchSales = async () => {
      try {
        const response = await fetch(`https://shopifystatsapi.azurewebsites.net/GetStoreUpdatedAts?storeLink=${name}`, {
          method: 'GET',
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${sessionToken}`,
          }
        });
    
        if (response.ok) {
          const data = await response.json();
          setSalesData(data);
          console.log(data);
    
          // Grouping sales by day and counting the number of sales for each day
          const salesCountByDay = data.reduce((acc: any, date: any) => {
            const day = new Date(date).toLocaleDateString();
            acc[day] = (acc[day] || 0) + 1 *0.25;

            return acc;
          }, {});


        // Calculate average sales count for the last 30 days
        const last30DaysLabels = Object.keys(salesCountByDay).slice(-30);
        const last30DaysSalesCount = last30DaysLabels.reduce(
          (sum, day) => sum + (salesCountByDay[day] || 0),
          0
        );
        const avgLast30DaysSalesCountValue = last30DaysSalesCount; // last30DaysSalesCount / last30DaysLabels.length; 


        setAvgLast30DaysSalesCount(avgLast30DaysSalesCountValue);
    

          const allTimeSalesLabels = Object.keys(salesCountByDay);

          const allTimeSalesChartData = {
            labels: allTimeSalesLabels,
            datasets: [
              {
                fill: true,
                label: "Daily sales",
                data: allTimeSalesLabels.map((day) => salesCountByDay[day]),
                borderColor: "rgb(40,100,252)",
                backgroundColor: "rgba(40,100,252,0.5)",
                lineTension: 0.3,
              },
            ],
          };

          // Update the state variable for all time sales chart
          setAllTimeSalesData(allTimeSalesChartData);
    
          const getLastNDaysChartData = (days: number) => {
            const currentDate = new Date(); // Use the current date dynamically
            const startDate = new Date(currentDate);
            startDate.setDate(currentDate.getDate() - days + 1); // Include today and subtract (days - 1)
          
            const formatDateString = (date: any) => {
              const [day, month, year] = date.split('.');
              return new Date(`${year}-${month}-${day}`);
            };
          
            const lastNDaysLabels = Object.keys(salesCountByDay).filter((day) => {
              const saleDate = formatDateString(day);
              return saleDate >= startDate && saleDate <= currentDate;
            });
          
          
            const lastNDaysSalesChartData = {
              labels: lastNDaysLabels,
              datasets: [
                {
                  fill: true,
                  label: `Daily sales`,
                  data: lastNDaysLabels.map((day) => salesCountByDay[day]),
                  borderColor: "rgb(40,100,252)",
                  backgroundColor: "rgba(40,100,252,0.5)",
                  lineTension: 0.3,
                },
              ],
            };
            return lastNDaysSalesChartData;
          };

          setLast7DaysSalesData(getLastNDaysChartData(7));
          setLast30DaysSalesData(getLastNDaysChartData(30));
          setLast90DaysSalesData(getLastNDaysChartData(90));
        } else {
          console.error('Failed to fetch data. Status:', response.status);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    

    Promise.all([fetchSales(), fetchTraffic()])
  .then(() => {

    setLoading(false);
  })
  .catch((error) => {

    console.error("Error fetching data:", error);
    setLoading(false); // Set loading to false even if there's an error
  });
  }, [name]);

  const traffic_labels = trafficData?.monthly_visitors.map((item) => item.date);
  const traffic = {
    labels: traffic_labels,
    datasets: [
      {
        fill: true,
        label: "Visitors",
        data: trafficData?.monthly_visitors.map((item) => item.value),
        borderColor: "rgb(40,100,252)",
        backgroundColor: "rgba(40,100,252,0.5)",
        lineTension: 0.3,
      },
    ],
  };

  if (loading) {
    return null;
  }

  if (!isNameInTrackedList) {
    return (
      <>
        <div id="no-store-message">NO STORE IN TRACKED LIST</div>
      </>
    );
  }

  return (
    <>
      <Row>
        <Col>
          <div className="grid-item">
            <div className="breadcrumb">
              <Link to="/">Dashboard</Link>
              <i className="fa-solid fa-chevron-right"></i>
              <Link to="/sales-tracker">Sales Tracker</Link>
              <i className="fa-solid fa-chevron-right"></i>
              <Link to={`/store?q=${name}`}>Store</Link>
            </div>
          </div>
        </Col>
      </Row>
      <section id="informations">
        <Row>
          <Col>
            <div className="grid-item">
              <img
                className="store-logo"
                src={trafficData?.logo || `../img/store.svg`}
              />

              <div className="rich-text">
                <p className="subtitle">Name</p>
                <h1>{trafficData?.sitename}</h1>
                <p className="subtitle">Description</p>
                <p>{trafficData?.description}</p>
                <a className="social-icon" href="https://instagram.com">
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a className="social-icon" href="https://instagram.com">
                  <i className="fa-brands fa-facebook"></i>
                </a>
                <a className="social-icon" href="https://instagram.com">
                  <i className="fa-brands fa-youtube"></i>
                </a>
                <a className="social-icon" href="https://instagram.com">
                  <i className="fa-brands fa-pinterest"></i>
                </a>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="grid-item">
              <Card className="bg-color-primary-500 color-neutral-100">
                <Row>
                  <div className="rich-text text-align-between">
                    <h6>Monthly Visitors</h6>
                    <Badge>
                      {trafficData?.percentage_increase !== undefined ? (
                        <>
                          {Math.abs(trafficData.percentage_increase)}%
                          {trafficData.percentage_increase > 0 && (
                            <i className="fas fa-arrow-up"></i>
                          )}
                          {trafficData.percentage_increase < 0 && (
                            <i className="fas fa-arrow-down"></i>
                          )}
                        </>
                      ) : (
                        "0%"
                      )}
                    </Badge>
                  </div>
                </Row>
                <Row>
                  <div className="rich-text">
                    <h3>
                      {trafficData?.monthly_visitors[2].value.toLocaleString()}
                    </h3>
                  </div>
                </Row>
              </Card>
            </div>
          </Col>
          <Col>
            <div className="grid-item">
              <Card>
                <Row>
                  <Col>
                    <div className="rich-text">
                      <h6>Monthly Sales</h6>
                      <h3>
                        {avgLast30DaysSalesCount
                          ? avgLast30DaysSalesCount.toFixed(0)
                          : "N/A"}
                      </h3>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          </Col>
          <Col>
            <div className="grid-item">
              <Card>
                <Row>
                  <Col>
                    <div className="rich-text">
                      <h6>Monthly Income</h6>
                      <h3>$
                        {trafficData && trafficData.avg_variant_price && avgLast30DaysSalesCount
                          ? parseFloat((trafficData.avg_variant_price * avgLast30DaysSalesCount).toFixed(2)).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })
                          : "N/A"}
                      </h3>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          </Col>
          <Col>
            <div className="grid-item">
              <Card>
                <Row>
                  <Col>
                    <div className="rich-text">
                      <h6>Monthly Revenue</h6>
                      <h3>~$
                        {trafficData && trafficData.avg_variant_price && avgLast30DaysSalesCount
                          ? (parseFloat((trafficData.avg_variant_price * avgLast30DaysSalesCount).toFixed(2)) * 0.25).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })
                          : "N/A"}
                      </h3>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          </Col>
        </Row>
      </section>
      <Tabs defaultActiveKey="sales">
        <Tab eventKey="sales" title="Sales">
          <section id="revenue">
            <Row>
              <Col xs={12} md={12} lg={12}>
                <div className="grid-item">
                  <Card>
                    <Tabs defaultActiveKey="all-time">
                      <Tab eventKey="all-time" title="All time"><Line options={options} data={allTimeSalesData} /></Tab>
                      <Tab eventKey="7-days" title="7 Days"><Line options={options} data={last7DaysSalesData} /></Tab>
                      <Tab eventKey="30-days" title="30 Days"><Line options={options} data={last30DaysSalesData} /></Tab>
                      <Tab eventKey="90-days" title="90 Days"><Line options={options} data={last90DaysSalesData} /></Tab>
                    </Tabs>
                  </Card>
                </div>
              </Col>
            </Row>
          </section>
        </Tab>
        <Tab eventKey="traffic" title="Traffic">
          {trafficData &&
          trafficData.top_countries &&
          trafficData.top_countries.length > 0 ? (
            <section id="traffic">
              <Row>
                <Col xs={12} md={12} lg={4}>
                  <div className="grid-item">
                    <Card>
                      <Row>
                        <Col>
                          <div className="rich-text">
                            <h2>Total visitors</h2>
                          </div>
                          <Line options={options} data={traffic} />
                        </Col>
                      </Row>
                    </Card>
                  </div>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <div className="grid-item">
                    <Card>
                      <Row>
                        <Col>
                          <div className="rich-text">
                            <h2>Traffic source</h2>
                          </div>
                          <table id="traffic-source">
                            {trafficData?.traffic_sources.map((traffic) => (
                              <tr key={traffic.source}>
                                <td id="traffic-icon">
                                  <img
                                    src={`../img/traffic/${traffic.handler}.svg`}
                                  />
                                </td>
                                <td>
                                  <div className="rich-text text-align-between">
                                    <p className="subtitle">{traffic.source}</p>
                                    <p>{traffic.value}%</p>
                                  </div>
                                  <ProgressBar now={traffic.value} />
                                </td>
                              </tr>
                            ))}
                          </table>
                        </Col>
                      </Row>
                    </Card>
                  </div>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <div className="grid-item">
                    <Card>
                      <Row>
                        <Col>
                          <div className="rich-text">
                            <h2>Top countries</h2>
                          </div>
                          <table id="top-country-traffic">
                            {trafficData?.top_countries.map((country) => (
                              <tr key={country.CountryCode}>
                                <td id="country-icon">
                                  <img
                                    src={`https://cdn.kcak11.com/CountryFlags/countries/${country.CountryCode.toLowerCase()}.svg`}
                                    alt={`${country.Country} flag`}
                                  />
                                </td>
                                <td>
                                  <div className="rich-text text-align-between">
                                    <p className="subtitle">
                                      {country.Country}
                                    </p>
                                    <p>{country.value}%</p>
                                  </div>
                                  <ProgressBar now={country.value} />
                                </td>
                              </tr>
                            ))}
                          </table>
                        </Col>
                      </Row>
                    </Card>
                  </div>
                </Col>
              </Row>
            </section>
          ) : null}
        </Tab> 
        <Tab eventKey="facebook-ads" title="Facebook Ads">
          <h1>COMMING SOON</h1>
        </Tab>
        <Tab eventKey="tbd" title="TBD">
          <h1>COMMING SOON</h1>
        </Tab>
      </Tabs>
    </>
  );
};

export default Store;
