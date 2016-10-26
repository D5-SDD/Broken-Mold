'use strict';

import React from 'react';
import {Row, Col, Panel} from 'react-bootstrap';

import {SKILLS} from '../../lib/Character';

import '../stylesheets/components/CharacterSheet';

const ICONS = {
  savingThrows: {
    true: 'star',
    false: 'star-o'
  },
  skill: {
    true: 'circle',
    false: 'circle-o'
  }
};

function getIcon(name, data) {
  //console.log(name, data);
  if (data !== undefined) {
    return (<i className={'fa fa-' + ICONS[name][data]} aria-hidden="true"/>);
  } else if (name !== undefined) {
    return (<i className={'fa fa-' + ICONS[name]} aria-hidden="true"/>);
  } else {
    return (<i className="fa fa-question" aria-hidden="true"/>);
  }
}

export class AbilityScore extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
    var name = this.props.name;
    var savingThrowsIcon = getIcon('savingThrows', this.props.savingThrows.proficient);
    var skills = [];
    for (let i = 0; i < SKILLS[name].length; i++) {
      let skill = SKILLS[name][i];
      let icon = getIcon('skill', this.props.skills[skill].proficient);
      let skillName = skill.charAt(0).toUpperCase() + skill.slice(1);
      skills.push(<div key={skill}>{icon} {this.props.skills[skill].value} {skillName}</div>);
    }

		return (
      <Row className="ability-score" id={name} >
        <Col className="col" md={4}>
          <Panel header={name} className="centered">
            <div className='ability-score value'>
              {this.props.value}
            </div>
            <div className='ability-score mod'>
              {this.props.mod}
            </div>
          </Panel>
        </Col>
        <Col className="col" md={8}>
          <Panel>
            <span className="saving-throws">
              {savingThrowsIcon} {this.props.savingThrows.value} Saving Throws
            </span>
            <div className="skills">
              {skills}
            </div>
          </Panel>
        </Col>
      </Row>
		);
	}
}

AbilityScore.propTypes = {
  mod: React.PropTypes.number.isRequired,
	name: React.PropTypes.string.isRequired,
  savingThrows: React.PropTypes.object.isRequired,
  skills: React.PropTypes.object.isRequired,
  value: React.PropTypes.number.isRequired
};

export class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return;
  }
}

Header.propTypes = {
};