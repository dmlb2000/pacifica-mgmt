import React from 'react';
import Axios from 'axios';

export const DisplayFormikState = props =>
    <div style={{ margin: '1rem 0' }}>
        <h3 style={{ fontFamily: 'monospace' }} />
        <pre
            style={{
                background: '#f6f8fa',
                fontSize: '.65rem',
                padding: '.5rem',
            }}
        >
            <strong>props</strong> ={' '}
            {JSON.stringify(props, null, 2)}
        </pre>
    </div>;

export const filtered_to_where_args = filtered => {
    let where_arg_list = [];
    for (let i = 0; i < filtered.length; i++) {
        if (filtered[i].id === '_id') {
            return `_id=${filtered[i].value}`;
        }
        if (filtered[i].disableLike) {
            where_arg_list.push(`${filtered[i].id}=${filtered[i].value}`)
        } else {
            where_arg_list.push(`${filtered[i].id}=${filtered[i].value}%&${filtered[i].id}_operator=like`)
        }
    }
    return where_arg_list.join('&')
}

export const getData = (md_url, object, filtered, pageSize, pageNum, saveData, savePages) => {
    let where_args = filtered_to_where_args(filtered)
    // fetch your data
    Axios.get(`${md_url}/objectinfo/${object}?${where_args}`)
        .then((res) => {
            // Update react-table
            savePages(Math.ceil(res.data.record_count / pageSize));
            Axios.get(`${md_url}/${object}?items_per_page=${pageSize}&page_number=${pageNum + 1}&${where_args}`)
                .then((res) => {
                    // Update react-table
                    saveData(res.data);
                })
        })
}