import React, { useState, useEffect } from 'react';
import { Card, CardSubtitle, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {

  const userId = localStorage.getItem('userId');
  const sessionToken = localStorage.getItem('sessionToken');
  const [isLoading, setIsLoading] = useState(true);
  const [TopDailyStores, SetTopDailyStores] = useState<{ storeLink: string; storeName: string; recordCount: number; index: number }[]>([]);
  const [TopWeeklyStores, SetTopWeeklyStores] = useState<{ storeLink: string; storeName: string; recordCount: number; index: number  }[]>([]);
  const storedData = localStorage.getItem('trackedStores');
  let trackedStoresCount = 0;
  if(storedData){
    const parsedData = JSON.parse(storedData);
    trackedStoresCount = parsedData.length;
  }


  useEffect(() => {
    fetchDailyStoresData();
    fetchWeeklyStoresData();
  }, []);

  const fetchDailyStoresData = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`https://shopifystatsapi.azurewebsites.net/GetTopStores?numberOfDays=1&topCount=5`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${sessionToken}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        SetTopDailyStores(data);
        console.log(data);
      } else {
        console.error('Failed to fetch data. Status:', response.status);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeeklyStoresData = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`https://shopifystatsapi.azurewebsites.net/GetTopStores?numberOfDays=7&topCount=3`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${sessionToken}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        SetTopWeeklyStores(data);
      } else {
        console.error('Failed to fetch data. Status:', response.status);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Row>
        <Col>
          <div className="grid-item">
            <div className="breadcrumb">
              <Link to="/">Dashboard</Link>
            </div>
          </div>
        </Col>
      </Row>
        <Row>
          <Col xs={6} md={3} lg={3}>
          <div className="grid-item">
            <Card className="bg-color-primary-500 color-neutral-100">
              <Row>
                <Col>
                  <div className="rich-text">
                    <h6>Tracked stores</h6>
                    <h3>{trackedStoresCount}</h3>
                  </div>
                </Col>
              </Row>
            </Card>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="grid-item">
              <Card>
              <div className="rich-text">
                <h6>Ranking</h6>
                <h3>Stores of day</h3>
              </div>
              <table className="top-stores-table">
                <tr>
                  <th>Rank</th>
                  <th>Store url</th>
                  <th>Name</th>
                  <th>Sales</th>
                </tr>
              {TopDailyStores.map((store, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td><a href={`https://${store.storeLink}`}>{store.storeLink}</a></td>
                            <td>{store.storeName}</td>
                            <td>{Math.round(store.recordCount * 0.25)}</td>
                          </tr>
                        );
                      })}
                  </table>
              </Card>
            </div>
          </Col>
          <Col>
            <Row>
              <Col>
              <div className="grid-item">
                <Card>
                <div className="rich-text">
                  <h6>Ranking</h6>
                  <h3>Stores of week</h3>
                </div>
                <table className="top-stores-table">
                <tr>
                  <th>Rank</th>
                  <th>Store url</th>
                  <th>Name</th>
                  <th>Sales</th>
                </tr>
                {TopWeeklyStores.map((store, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td><a href={`https://${store.storeLink}`}>{store.storeLink}</a></td>
                            <td>{store.storeName}</td>
                            <td>{Math.round(store.recordCount * 0.25)}</td>
                          </tr>
                        );
                      })}
                      </table>
                </Card>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
    </>
  );
};

export default Dashboard;