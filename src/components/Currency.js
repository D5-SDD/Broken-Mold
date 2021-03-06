'use strict';

// Inport libraries
import React from 'react';
import {FormGroup, FormControl, Panel, Table} from 'react-bootstrap';
import capital from 'to-capital-case';
import _ from 'lodash';

// Displays a character's currency in the Character Sheet View
class Currency extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var currencies = [];
    var currViewState = this.props.viewState;
    // Add currencies to table
    // If editing, add editable boxes instead of numbers
    _.forIn(this.props.currency, function(value, key) {
      var properValue = value;
      if (currViewState === 1) {
        properValue = (
          <FormGroup>
            <label>
              {capital(key)}
              <FormControl
                id={'csform-money-' + capital(key)}
                type="number"
                defaultValue={properValue}
                min="0"
              />
            </label>
          </FormGroup>
        );
        currencies.push(
          <tr key={key}>
            <td>{properValue}</td>
          </tr>
        );
      } else {
        currencies.push(
          <tr key={key}>
            <td>{capital(key)}</td>
            <td>{properValue}</td>
          </tr>
        );
      }
    });

    return (
      <Panel header="Currency">
        <Table fill bordered>
          <tbody>
            {currencies}
          </tbody>
        </Table>
      </Panel>
    );
  }
}

Currency.propTypes = {
  viewState: React.PropTypes.number.isRequired,
  currency: React.PropTypes.shape({
    platinum: React.PropTypes.number,
    gold: React.PropTypes.number,
    electrum: React.PropTypes.number,
    silver: React.PropTypes.number,
    copper: React.PropTypes.number
  }).isRequired
};

export default Currency;
