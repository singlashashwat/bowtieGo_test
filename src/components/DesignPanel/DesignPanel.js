import React from 'react';
import classNames from "classnames";
import { connect } from 'react-redux';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Papa from 'papaparse';
import 'bootstrap/dist/css/bootstrap.css';
import './designPanel.scss';

import PickerPanel from '../PickerPanel';

import arrow from './adjust-text-size.png';
import arrow_down from './arrow.png';

class DesignPanel extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: [],
            disList: [],
            distValue: '',
            addList: [],
            addValue: '',
            region: [],
            locList: [],
            showPopup: false,
            showRegion: false,
            font_type_name: ''
        };
	this.getRegionList = this.getRegionList.bind(this);
  this.handleRegion = this.handleRegion.bind(this);
  this.handleLocation = this.handleLocation.bind(this);
  this.convert = this.convert.bind(this);
  this.handleChange = this.handleChange.bind(this);
  this.handleClick = this.handleClick.bind(this);
  this.handleFontClick  = this.handleFontClick.bind(this);
  this.handleFontType = this.handleFontType.bind(this);
  this.handleOutsideClick = this.handleOutsideClick.bind(this);

    }

    componentWillMount() {

      // Read the CSV file 
      var self =this;
        var csvFilePath = require("./doctors.csv");
        Papa.parse(csvFilePath, {
          header: true,
          download: true,
          skipEmptyLines: true,
          complete: function(results) {
            self.setState({data: results.data});
            self.getRegionList();
          }
        });
    }

    // get Area List
    getRegionList () {
      let data = this.state.data;
      let region = [];
      for (var i =0; i < data.length; i++) { 
        if(region.indexOf(data[i].Region) < 0) {
        region.push(data[i].Region);
        }
      }
      this.setState({region,addList: []});
    }

    // manage Area after choose
    handleRegion(reg) {
      let val = reg.value;
      let data = this.state.data;
      let disList = [];
      data.forEach(function (loc) {
        if (loc.Region === val && disList.indexOf(loc.Location) < 0) {
          disList.push(loc.Location);
        } 
      });
      this.setState({disList, distValue: reg, addValue: '', addList: []});
    }

    // manage Location after choose
    handleLocation (loc) {
      var self =this;
    let val = loc;
      let data = this.state.data;
      
      let locList = [];
      data.forEach(function (loc) {
        if (loc.Region === val && locList.indexOf(loc.Location) < 0) {
          let res = self.convert(loc);
          locList.push(res.Location);
        } 
      });
      this.setState({locList: locList});
    }

    convert(obj) {
      const result = {};
      Object.keys(obj).forEach(function (key) {
        result[key.replace(/\s/g, "")] = obj[key];
      });
      return result;
    }

    handleChange(e, selectedOption){
      e.preventDefault();
      let self = this;
      let data = this.state.data;
      let addList = [];
      data.forEach(function (loc) {
        if (loc.Location === selectedOption) {
          let res = self.convert(loc);
          addList.push(res);
        } 
      });
      this.setState({addList, addValue: selectedOption})
      this.handleClick(e);
  }

handleClick (e) {
  e.preventDefault();
  if (this.state.showPopup && this.state.showRegion )  {
    document.removeEventListener('click', this.handleOutsideClick, false);
    this.setState({showPopup: false, showRegion: false})
  }else {
    document.addEventListener('click', this.handleOutsideClick, false);
    this.setState({showPopup: true, showRegion: true})
  }
}

handleOutsideClick(e) {
  // ignore clicks on the component itself
  if (this.node.contains(e.target)) {
    return;
  }

  this.handleClick(e);
}

handleFontClick(e) {
  if (e.target.id === "New Terriroties") {
    this.setState({font_type_name: 'New Terriroties', addList: []})
  } else if (e.target.id === "Kowloon") {
    this.setState({font_type_name: 'Kowloon', addList: []})
  } else if (e.target.id === "New Territories") {
    this.setState({font_type_name: 'New Territories', addList: []})
  } else if (e.target.id === "Hong Kong Island") {
    this.setState({font_type_name: 'Hong Kong Island', addList: []})
  } else {
    this.setState({font_type_name: 'Hong Kong', addList: []})
  }
  this.handleLocation(e.target.id);
}

handleFontType () {
  this.setState({showRegion: true, locList: []})
}

    render() {
      let addList = this.state.addList;
      let disList = this.state.disList;
      const style = this.props.currentOption === this.props.font_type_name ? "show_check_icon" : "";
       

      const renderElements1 = this.state.region ? this.state.region.map((element, index) =>
                (<li onClick={this.handleFontClick} key={index} id={element}
                className={this.state.font_type_name === element ? "label_container english_fonts selectedfont_type" : "label_container english_fonts"}>{element}</li>
                )
            ) : [];
        
      const renderElements = this.state.locList ? this.state.locList.map((element, index) =>
                (<PickerPanel
                    key={index}
                    ref={(cd) => this.pageRef = cd}
                    data={element}
                    id={`${this.props.id}_${index}`}
                    handleChange={this.handleChange}
                    currentOption={this.state.addValue}
                />)
            ) : [];

          const is_active =  "active_btn";

        return (
          <div className="fontfamily">
              <div className="row  m-3">
                <div className="col-12 d-flex justify-content-center align-items-center">
                  <div><span className="col-12">Location:</span></div>
                    <div>
                    <div className="property_panel m-3" x-placement="bottom-start">
                <div className="property_title">
                    <div className="property_container">
                        <button className={classNames("property_btn", is_active)} onClick={e =>this.handleClick(e)}>
                            <div className="property_title_box">
                                <div className={classNames("label_width", "label_width_fsize")}>
                                    <input className="property_label" type="text" pattern="\d*" max="100"
                                               min="1" step="0.1" placeholder="– –" onFocus={e => e.target.select()}
                                               value={this.state.addValue}
                                               onChange={e => this.handleInputChange(e)} disabled/>
                                      
                                </div>
                                <div className="img_class"><img src={arrow} height={30}/></div>
                            </div>
                        </button>
                    </div>
                </div>
                </div>
                <div ref={node => { this.node = node; }}>
            {this.state.showPopup ? <div className="popup_contianer show_popup_contianer show_popup_contianer">
              <div className="square_contianer s_contianer">
                  <div id="picker-panel" className="picker-panel">
                    <ul className="picker_list widget-list">
                      <div> 
                          <div className="font_type_container" ><span onClick={this.handleFontType} className={classNames("font_type", this.state.font_type_modal ? 'toggled' : '')}>{this.state.font_type_name}</span>
                          <div className="choose_font_type" style={{display: this.state.showRegion ? 'block' : 'none'}}>
                              <ul>
                                {renderElements1}
                              </ul>
                          </div></div>
                          <hr/>
                          </div>
                          <div style={{display: 'block'}}>
                              <span>{renderElements}</span>
                          </div>
                    </ul>
                  </div>
                </div>                     
            </div> : ""}</div>
                    
                     </div>
                </div>
              </div>

            
            <div className="row">
            {addList && addList.length > 0 ?addList.map(address => (
              <div className="col-6" key={address.DoctorID}>
                <div className="inner_container col-12 border-top">
                    <div className="col-12 doctor_name" style={{fontSize: 15,fontWeight: "bold", marginTop: 18}}>
                      {address.Name}
                    </div>
                    
                    {
                      address.ServiceType.indexOf("PHY") > -1 ? <div className="ServiceType">Physiotherapy</div> : ''
                       /* address.ServiceType == "PHY" ? <div className="ServiceType">Physiotherapy</div> : ''
                      */
                      }
                      {
                      address.ServiceType.indexOf("SPL") > -1 ? <div className="ServiceType">Specialist Practitioner</div> : ''
                       /* address.ServiceType == "PHY" ? <div className="ServiceType">Physiotherapy</div> : ''
                      */
                      }
                      {
                        address.ServiceType.indexOf("HER") > -1  ? <div className="ServiceType">Chinese Herbalist </div>: ''
                      }
                      {
                        address.ServiceType.indexOf("ACU") > -1  ? <div className="ServiceType">Acupuncture</div>: ''
                      }
                      {
                        address.ServiceType.indexOf("BST") > -1  ? <div className="ServiceType">Bonesetter</div>: ''
                      }
                    <div className="col-12 doctor_address" style={{fontSize: 15,fontWeight: "bold", marginTop: 15}}>
                      {address.Address2}
                    </div>
                    <div className="col-12 doctor_phone" style={{fontSize: 12}}>
                      {address.Telephone1}
                    </div>
                    <div className="col-12 multiple_phone" style={{fontSize: 12}}>
                      <div>Member exclusive price:</div>
                    </div>
                    <div className="col-12 price" style={{fontSize: 12}}>

                    {address.ServiceType} Fee: ${address.Price}
                      </div>
                    <div className="col-12 day_seq1" style={{fontSize: 12}}>
                      {
                        address.DaySeq1 ? address.DaySeq1 + ": " + address.DaySeq1time : ''
                      }
                      { address.DaySeq1 && address.DaySeq2 ? " | " : ''}
                      {
                        address.DaySeq2 ? address.DaySeq2 + ": " + address.DaySeq2time : ''
                      }
                      { address.DaySeq2 && address.DaySeq3 ? " | " : ''}
                      {
                        address.DaySeq3 ? address.DaySeq3 + ": " + address.DaySeq3time : ''
                      } 
                      { address.DaySeq3 && address.DaySeq4 ? " | " : ''}
                      {
                        address.DaySeq4 ? address.DaySeq4 + ": " + address.DaySeq4time : ''
                      }
                      </div>
                    
                  </div>
              </div>
            )): ''}
            </div>
          </div>
            )
    }
}


const mapStateToProps = state => ({
  
})

const mapDispatchToProps = dispatch => ({
  
})

export default connect(mapStateToProps, mapDispatchToProps)(DesignPanel)
