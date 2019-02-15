import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import PacificaTable from './PacificaTable';
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