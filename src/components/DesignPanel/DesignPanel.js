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
    let val = loc.value;
      let data = this.state.data;
      let addList = [];
      data.forEach(function (loc) {
        if (loc.Location === val) {
          addList.push(loc);
        } 
      });
      this.setState({addList, addValue: loc});
    }

    render() {
      let addList = this.state.addList;
      let disList = this.state.disList;
        return (
          <div>
            <div class="row  m-3">
              <div class="col-12 d-flex justify-content-center align-items-center">
                <div clas="col-5"><span class="col-12  m-3">Area:</span></div>
                  <div class="col-7">
                    <Dropdown key="region_dropdown" options={this.state.region} onChange={this.handleRegion} value={this.state.distValue} placeholder="Select an option" />
                  </div>
              </div>
            </div>
            
            {disList && disList.length > 0 ?
              <div class="row  m-3">
                <div class="col-12 d-flex justify-content-center align-items-center">
                  <div clas="col-5"><span class="col-12">Location:</span></div>
                    <div class="col-7">
                    <Dropdown key="location_dropdown" options={this.state.disList} onChange={this.handleLocation} value={this.state.addValue} placeholder="Select an option" />
                    </div>
                </div>
              </div>
            :''}
            <div class="row">
            {addList && addList.length > 0 ?addList.map(address => (
              <div class="col-6">
                <div class="inner_container col-12 border-top">
                    <div class="col-12 doctor_name">
                      {address.Name}
                    </div>
                    <div class="col-12 doctor_address">
                      {address.Address2}
                    </div>
                    <div class="col-12 doctor_phone">
                      {address.Telephone1}
                    </div>
                    <div class="col-12 multiple_phone">
                      <div>Member exclusive price:</div>
                    </div>
                    <div class="col-12 day_seq1">
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
