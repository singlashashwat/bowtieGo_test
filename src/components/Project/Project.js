import React from 'react';
import classNames from "classnames";
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import * as Sentry from '@sentry/browser';

import DesignPanel from '../DesignPanel';

//css and images
import projectStyles from './project.css';



class Project extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            error: null
        };
        this.designPanelRef = React.createRef();
    }

    componentDidCatch(error, errorInfo) {
      this.setState({ error });
      Sentry.withScope(scope => {
        Object.keys(errorInfo).forEach(key => {
          scope.setExtra(key, errorInfo[key]);
        });
        Sentry.captureException(error);
      });
    }


    componentDidMount () {
        
    }

    render() {
        const design_panel = <DesignPanel ref="designPanelRef" key="design_panel"/>;

        const normal = () => [design_panel];

        return (
            <div key="Project" className="project_container">
                <div className="second_layer">
                    <Router>
                        <main className="main">
                            <Route exact path="/" component={normal} />
                        </main>
                    </Router>
                </div>
                <div className={classNames('loading_overlay', {'hide' : !this.props.isLoading}) }/>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isLoading: state.isProjectLoading
})

const mapDispatchToProps = dispatch => ({
  
})

export default connect(mapStateToProps, mapDispatchToProps)(Project)
