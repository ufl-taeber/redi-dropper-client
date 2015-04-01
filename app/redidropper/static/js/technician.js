
// @TODO: move to a separate "utils" class

function render_subject_files() {
    var data = {"subject_id": "1"};
    var request = api_request("/api/list_subject_files", "POST", data, "json", true);
}

function api_request(url, reqType, data, dataType, doCache) {
    return $.ajax({
        url: url,
        type: reqType,
        data: data,
        dataType: dataType,
        cache: doCache
    });
}

function getProjectsList(){
    return [{project_id:"1",project_name:"1st Project"},{project_id:"2",project_name:"2nd Project"}]
}

function getSubjectsList(){
    return {
        max_events:12,
        subjects_data:
            [
                {subject_id:"1",subject_name:"Subject 1",events:[{event_id:23:event_files:0,event_id:23,event_files:100}]},
                 {subject_id:"2",subject_name:"Subject 2",events:[{event_id:23,event_files:50},{event_id:23,event_files:30},{event_id:23,event_files:30},{event_id:23,event_files:30},{event_id:23,event_files:30},{event_id:23,event_files:30}]},
                        {subject_id:"3",subject_name:"Subject 3",events:[{event_id:23,event_files:30},{event_id:23,event_files:30},{event_id:23,event_files:30},{event_id:23,event_files:30}]},
                        {subject_id:"4",subject_name:"Subject 4",events:[{event_id:23,event_files:10},{event_id:23,event_files:30},{event_id:23,event_files:30}]},
                        {subject_id:"5",subject_name:"Subject 5",events:[{event_id:23,event_files:16}]},
                        {subject_id:"6",subject_name:"Subject 6",events:[{event_id:23,event_files:18}]}
                        ]};
}

var SubjectsRow = React.createClass({
  getInitialState: function() {
    return {row_data:this.props.row_data,max_events:this.props.max_events};
  },
  render: function() {
    var column_count = this.state.max_events;
    var table_columns=[];
    var row_data=this.state.row_data;
    var events_count=row_data.events.length;
    for(var i=0;i<events_count;i++){
        console.log(this.props.row_data.subject_id);
        var view_files_url="/users/project";

        table_columns.push(<td><a href={view_files_url}>{row_data.events[i].event_id}</a></td>);
    }
    for(var i=events_count+1;i<=column_count;i++){
        var upload_url="/users/upload/"+row_data.subject_id;
        table_columns.push(<td><a href={upload_url}><i className="fa fa-lg fa-plus-circle"></i></a></td>);
    }

    return (
        <tr>
        <td>{row_data.subject_id}</td>
        <td>{row_data.subject_name}</td>
        {table_columns}
        </tr>
    );
}
});

var SubjectsTable = React.createClass({
  getInitialState: function() {
    return {subjects:getSubjectsList()};
  },
  componentWillMount:function(){
    /*
    var request = api_request("/api/list_redcap_subjects", "POST",{}, "json", true);
    var _this=this;
    request.success( function(json) {
        console.log("success "+json);
        _this.setState({subjects:json});
    });
    request.fail(function (jqXHR, textStatus, error) {
        console.log('Failed: ' + textStatus + error);
    });*/
  },
  render: function() {
    var column_count = this.state.subjects.max_events;
    var subjects_data=this.state.subjects.subjects_data;
    var row_count = subjects_data.length;
    var table_columns=[];
    table_columns.push(<th>Subject ID</th>);
    table_columns.push(<th>Name</th>);
    for(var i=1;i<=column_count;i++){
        table_columns.push(<th> Event {i}</th>);
    }

    var table_rows= [];
    for(var i=0;i<row_count;i++){
        table_rows.push(<SubjectsRow row_data={subjects_data[i]} max_events={column_count}/>);
    }

    return (
    <div className="table-responsive">
        <div>{this.props.selected_project}</div>
        <table id="technician-table" className="table table-striped">
            <thead>
                <tr>
                    {table_columns}
                </tr>
            </thead>
            <tbody id="technician-table-body">
                {table_rows}
            </tbody>
        </table>
    </div>
    );
  }
});

var Technician = React.createClass({
  getInitialState: function() {
    return {projects:getProjectsList(),selected_project:0,error:[]};
  },
  componentWillMount:function(){
    /*
    var request = api_request("/api/list_redcap_subjects", "POST", data, "json", true);
    request.success( function(json) {
        this.setState({projects:json,selected_project:json[0].id});
    });
    request.fail(function (jqXHR, textStatus, error) {
        console.log('Failed: ' + textStatus + error);
    });
    */
  },
  selectChanged:function(){
    console.log("select changed "+this.refs.project_select.getDOMNode().value);
    var new_selected_value = this.refs.project_select.getDOMNode().value;
    this.setState({projects:this.state.projects,selected_project:new_selected_value});
  },
  render: function() {

    return (
    <div>
    <div className="row">
        <div className="col-sm-4">
            <h3> Project Name </h3>
        </div>
        <div className="col-sm-4">
            <select onChange={this.selectChanged}  className="form-control" ref="project_select">
                {this.state.projects.map(function(record,i) {
                        return <option value={record.project_name}>{record.project_name}</option>           
                })};  
            </select>
        </div>
        <div className="col-sm-4">
        </div>
    </div>
        <br/>
        <h3>List of Subjects </h3>
        <br/>
        <SubjectsTable selected_project={this.state.selected_project}/>
    </div>
    );
  }
});


React.render(<Technician/>, document.getElementById("technician"));
