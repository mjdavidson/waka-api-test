import * as React from 'react';
import { useState, useEffect } from 'react';
import { HomeProps } from './types';
import { withRouter } from 'react-router-dom';

function Home(props: HomeProps) {
  const [regions, setRegions] = useState<{
    [prefix: string]: {
      bounds: {
        lat: { min: number; max: number };
        lon: { min: number; max: number };
      };
      initalLocation: [number, number];
      name: string;
      prefix: string;
      longName: string;
      secondaryName: string;
      showInCityList: boolean;
      version: string;
    };
  }>({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res1 = await fetch(`/regions`);
      const info = await res1.json();
      setRegions(info);
      setLoading(false);
    };
    fetchData();
  }, []);
  if (loading) {
    return <h1>loading...</h1>;
  }
  console.log(regions);
  if (!loading && Object.keys(regions).length > 0) {
    return (
      <div>
        <select
          name="regions"
          id="regions"
          onChange={e => {
            props.history.push(`/${e.target.value}/stops`);
          }}
        >
          <option>pick a region</option>
          {Object.keys(regions).map(region => (
            <option value={regions[region].prefix}>
              {regions[region].longName}
            </option>
          ))}
        </select>
      </div>
    );
  }
  return null;
}

export default withRouter(Home);
