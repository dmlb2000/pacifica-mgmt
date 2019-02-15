import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import PacificaTable from './PacificaTable';
import PacificaModal from './PacificaModal';
import PacificaForm from './PacificaForm';
import user_inputs from './users_input.json';
import project_inputs from './proposal_input.json';
import instrument_inputs from './instrument_input.json';
import './App.css';
import './Tabs.css';

function TabContainer(props) {
    return (
        <Typography
            component="div"
            style={{ padding: 8 * 3 }}
        >
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

const styles = theme => ({
    root: { flexGrow: 1 }
});


class App extends Component {
    state = { value: 0 };

    handleChange = (event, value) => {
        this.setState({
            value
        });
    };

    render() {
        const {
            classes
        } = this.props;
        const {
            value
        } = this.state;
        return (
            <div className={classes.root} id="root">
                <h1>Metadata Editor</h1>
                <AppBar position="static">
                    <Tabs value={value} onChange={this.handleChange}>
                        <Tab label="Users" />
                        <Tab label="Projects" />
                        <Tab label="Instruments" />
                    </Tabs>
                </AppBar>
                {value === 0 &&
                    <TabContainer>
                        <PacificaModal action='Create' obj_nice_name='User' obj_name='users'>
                            <PacificaForm inputs={user_inputs} md_url="/mdapi" object="users" method="put"/>
                        </PacificaModal>
                        <PacificaTable
                        md_url="/mdapi"
                        object="users"
                        object_nice_name="User"
                        columns={
                            [
                                {
                                    Header: 'User ID',
                                    accessor: '_id'
                                }, {
                                    Header: 'Network ID',
                                    accessor: 'network_id'
                                }, {
                                    Header: 'First Name',
                                    accessor: 'first_name'
                                }, {
                                    Header: 'Last Name',
                                    accessor: 'last_name'
                                }
                            ]
                        }
                        />
                    </TabContainer>}
                {value === 1 &&
                    <TabContainer>
                    <PacificaModal action='Create' obj_nice_name='Project' obj_name='projects'>
                        <PacificaForm inputs={project_inputs} md_url="/mdapi" object="proposals" method="put"/>
                    </PacificaModal>
                    <PacificaTable
                        md_url="/mdapi"
                        object="proposals"
                        object_nice_name="Proposal"
                        columns={
                            [
                                {
                                    Header: 'Project ID',
                                    accessor: '_id'
                                }, {
                                    Header: 'Short Name',
                                    accessor: 'short_name'
                                }, {
                                    Header: 'Title',
                                    accessor: 'title'
                                }
                            ]
                        }
                    />
                    </TabContainer>}
                {value === 2 &&
                    <TabContainer>
                    <PacificaModal action='Create' obj_nice_name='Instrument' obj_name='instruments'>
                        <PacificaForm inputs={instrument_inputs} md_url="/mdapi" object="instruments" method="put" />
                    </PacificaModal>
                    <PacificaTable
                        md_url="/mdapi"
                        object="instruments"
                        object_nice_name="Instrument"
                        columns={
                            [
                                {
                                    Header: 'Instrument ID',
                                    accessor: '_id'
                                }, {
                                    Header: 'Display Name',
                                    accessor: 'display_name'
                                }, {
                                    Header: 'Name Short',
                                    accessor: 'name_short'
                                }, {
                                    Header: 'Name',
                                    accessor: 'name'
                                }
                            ]
                        }
                    />
                    </TabContainer>}
            </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);