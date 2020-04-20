import React from 'react';
import classNames from "classnames";

//css
import selectStyles from './pickerPanel.css';
import check_icon from './check-mark.png';
import spinner_dot from './spinnerdots.svg';

export default class List extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const font = this.props.data;
        const img_icon = [this.props.data.img];
        const style = this.props.currentOption === this.props.data ? "show_check_icon" : "";
       
        return (

                <li className="list_style" onClick={(e) => this.props.handleChange(e, this.props.data)} >
                    <button className="list_btn">
                        <div className="list_box picker_panel_list_box_width">
                            <div className={classNames("label_container", style ? "selectedfont_type" : "")} >
                                {this.props.data}
                            </div>
                            <span><img src={check_icon} className={classNames("check_icon", style)} /></span>
                        </div>
                    </button>
                </li>

        )
    }
}
