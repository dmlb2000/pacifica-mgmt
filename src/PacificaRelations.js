import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { getData } from './helper';
import PacificaForm from './PacificaForm';

const column_map = {
    users: {
        tables: [
            {
                columns: [{
                    Header: "Proposal ID",
                    accessor: "proposal_id"
                }],
                state_save: 'proposals',
                object: "proposal_participant",
                key: "person_id",
                class: "PacificaFloatLeft"
            }, {
                columns: [{
                    Header: "Instrument ID",
                    accessor: "instrument_id"
                }],
                state_save: 'instruments',
                object: "instrument_custodian",
                key: "custodian_id",
                class: "PacificaFloatRight"
            }
        ]
    },
    proposals: {
        tables: [
            {
                columns: [{
                    Header: "User ID",
                    accessor: "person_id"
                }],
                state_save: 'users',
                object: "proposal_participant",
                key: "proposal_id",
                class: "PacificaFloatLeft"
            }, {
                columns: [{
                    Header: "Instrument ID",
                    accessor: "instrument_id"
                }],
                state_save: 'instruments',
                object: "proposal_instrument",
                key: "proposal_id",
                class: "PacificaFloatRight"
            }
        ]
    },
    instruments: {
        tables: [
            {
                columns: [{
                    Header: "User ID",
                    accessor: "custodian_id"
                }],
                state_save: 'users',
                object: "instrument_custodian",
                key: "instrument_id",
                class: "PacificaFloatLeft"
            }, {
                columns: [{
                    Header: "Proposal ID",
                    accessor: "proposal_id"
                }],
                state_save: 'proposals',
                object: "proposal_instrument",
                key: "instrument_id",
                class: "PacificaFloatRight"
            }
        ]
    }
}

class PacificaRelations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                users: [],
                proposals: [],
                instruments: []
            },
            filtered: {
                users: [],
                proposals: [],
                instruments: []
            },
            pages: {
                users: -1,
                proposals: -1,
                instruments: -1
            },
            pageNum: {
                users: 0,
                proposals: 0,
                instruments: 0
            },
            pageSize: {
                users: 20,
                proposals: 20,
                instruments: 20
            },
            loading: true,
        };
    }
    render() {
        let tables = column_map[this.props.object].tables.map((table_map) => {
            return (
                <div className={table_map.class}>
                    <PacificaForm
                        inputs={[
                            {
                                id: table_map.columns[0].accessor,
                                label: table_map.columns[0].Header
                            }
                        ]}
                        additionalValues={{
                            [table_map.key]: this.props.object_id
                        }}
                        md_url="/mdapi"
                        object={table_map.object}
                        method="put"
                        postSubmitHook={() => {
                            this.setState({
                                loading: true
                            });
                            getData(
                                this.props.md_url,
                                table_map.object,
                                [{ disableLike: true, id: [table_map.key], value: this.props.object_id }],
                                this.state.pageSize[table_map.state_save],
                                this.state.pageNum[table_map.state_save],
                                (data) => { 
                                    this.setState(prevState => ({
                                        ...prevState,
                                        data: {
                                            ...prevState.data,
                                            [table_map.state_save]: data
                                        },
                                        loading: false
                                    }));
                                },
                                (pages) => {
                                    this.setState(prevState => ({
                                        ...prevState,
                                        pages: {
                                            ...prevState.pages,
                                            [table_map.state_save]: pages
                                        }
                                    }));
                                }
                            )
                        }}
                    />
                    <ReactTable
                        key={`${this.props.object}_${table_map.object}`}
                        filterable={false}
                        data={this.state.data[table_map.state_save]}
                        pages={this.state.pages[table_map.state_save]}
                        columns={table_map.columns}
                        defaultPageSize={5}
                        manual
                        onFetchData={(state, instance) => {
                            this.setState({
                                loading: true
                            });
                            getData(
                                this.props.md_url,
                                table_map.object,
                                [{ disableLike: true, id: [table_map.key], value: this.props.object_id }],
                                state.pageSize,
                                state.page,
                                (data) => {
                                    this.setState(prevState => ({
                                        ...prevState,
                                        data: {
                                            ...prevState.data,
                                            [table_map.state_save]: data
                                        },
                                        loading: false
                                    }));
                                },
                                (pages) => {
                                    this.setState(prevState => ({
                                        ...prevState,
                                        pages: {
                                            ...prevState.pages,
                                            [table_map.state_save]: pages
                                        }
                                    }));
                                }
                            )
                        }}
                        onPageChange={pageNum => this.setState({ pageNum: { [table_map.state_save]: pageNum } })}
                        onPageSizeChange={pageSize => this.setState({ pageSize: { [table_map.state_save]: pageSize } })}
                    />
                </div>
            );
    });
    return (
            <div>
                {tables}
            </div>
        );
    }
}

PacificaRelations.propTypes = {
    object: PropTypes.instanceOf(String).isRequired,
    object_id: PropTypes.instanceOf(String).isRequired,
    object_nice_name: PropTypes.instanceOf(String).isRequired,
    md_url: PropTypes.instanceOf(String).isRequired,
};

export default PacificaRelations;
