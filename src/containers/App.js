'use strict';

// Import React and components
import React from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import CharacterView from './CharacterView';
import DMView from './DMView';

// Import libraries
import fs from 'fs';
import Character, {readMap, exportMap} from '../../lib/Character';

// Import stylesheet
import '../stylesheets/containers/App.scss';

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    
    this.characters = readMap();

    this.characters[0].race = 'Dragon-Born';
    //console.log(this.characters[0].getListOfSpells(['Wizard'],'level1'));
    //this.characters[0].saveCharacter();
    //exportMap(this.characters, './test/character_map.json');
  }

  // Called when a new tab is selected
  _handleSelect(selectedKey) {
    this.setState({activeTab: selectedKey});
  }

  render() {
    return (
      <Tabs defaultActiveKey={1} animation={true} id="app-tabs">
        <Tab eventKey={1} title="Characters">
          <CharacterView characterMap={this.characters} />
        </Tab>
        <Tab eventKey={2} title="Dungeon Master">
          <DMView />
        </Tab>
        <Tab eventKey={3} title="Networking" disabled>
          <h2>Why are you here? This tab isn't working yet</h2>
        </Tab>
      </Tabs>
    );
  }
}

export default AppContainer;
