import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
class Stops extends Component {
  constructor() {
    super();
    this.state = {
      stops: [],
      loading: false
    };
  }

  componentDidMount = async () => {
    const {
      match: {
        params: { region }
      }
    } = this.props;
    this.setState({ loading: true });
    const res = await fetch(`/${region}/stops/all`);
    const data = await res.json();
    this.setState({ stops: data, loading: false });
  };

  render() {
    const { stops, loading } = this.state;
    if (loading) {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      );
    }
    if (stops.length > 0) {
      return (
        <>
          {stops.slice(null, 100).map(stop => (
            <div key={stop.stop_id}>
              <a href={`stop/${stop.stop_id}`}>{stop.stop_name}</a>
            </div>
          ))}
        </>
      );
    }
    return (
      <div>
        <h1>no stops</h1>
      </div>
    );
  }
}
export default withRouter(Stops);
