import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';


export default class NavBar extends React.Component {

    render()    {
        return (
            <AppBar
                title="Network Adequacy"
                iconClassNameRight="muidocs-icon-navigation-expand-more"
                style={{backgroundColor: "#616161"}}
            />
        );
    }
}
