import React from 'react';
import classNames from "classnames";
import { connect } from 'react-redux';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Papa from 'papaparse';
import 'bootstrap/dist/css/bootstrap.css';


class DesignPanel extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: [],
            disList: [],
            distValue: '',
            addList: [],
            addValue: '',
	          region: []
        };
	this.getRegionList = this.getRegionList.bind(this);
  this.handleRegion = this.handleRegion.bind(this);
  this.handleLocation = this.handleLocation.bind(this);
  this.convert = this.convert.bind(this);
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
      this.setState({region});
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
    let val = loc.value;
      let data = this.state.data;
      let addList = [];
      data.forEach(function (loc) {
        if (loc.Location === val) {
          let res = self.convert(loc);
          addList.push(res);
        } 
      });
      this.setState({addList, addValue: loc});
    }

    convert(obj) {
      const result = {};
      Object.keys(obj).forEach(function (key) {
        result[key.replace(/\s/g, "")] = obj[key];
      });
      return result;
    }

    render() {
      let addList = this.state.addList;
      let disList = this.state.disList;
        return (
          <div>
            <div className="row  m-3">
              <div className="col-12 d-flex justify-content-center align-items-center">
                <div className="col-1"><span className="col-12  m-3">Area:</span></div>
                  <div className="col-7">
                    <Dropdown key="region_dropdown" options={this.state.region} onChange={this.handleRegion} value={this.state.distValue} placeholder="Select an option" />
                  </div>
              </div>
            </div>
            
            {disList && disList.length > 0 ?
              <div className="row  m-3">
                <div className="col-12 d-flex justify-content-center align-items-center">
                  <div className="col-1"><span className="col-12">Location:</span></div>
                    <div className="col-7">
                    <Dropdown key="location_dropdown" options={this.state.disList} onChange={this.handleLocation} value={this.state.addValue} placeholder="Select an option" />
                    </div>
                </div>
              </div>
            :''}
            <div className="row">
            {addList && addList.length > 0 ?addList.map(address => (
              <div className="col-6" key={address.DoctorID}>
                <div className="inner_container col-12 border-top">
                    <div className="col-12 doctor_name">
                      {address.Name}
                    </div>
                    <div className="col-12 doctor_address">
                      {address.Address2}
                    </div>
                    <div className="col-12 doctor_phone">
                      {address.Telephone1}
                    </div>
                    <div className="col-12 multiple_phone">
                      <div>Member exclusive price:</div>
                    </div>
                    <div className="col-12 day_seq1">
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
                    <div className="col-12 price">
                    ${address.Price}
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
