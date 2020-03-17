//// Libraries
import _ from 'lodash';
import React, { PureComponent } from 'react';

// Services
import { getDataSourceSrv } from '@grafana/runtime';

// Types
import { PanelEditorProps, FieldConfig, DataSourceSelectItem } from '@grafana/data';
import {
  Switch,
  LegendOptions,
  GraphTooltipOptions,
  PanelOptionsGrid,
  PanelOptionsGroup,
  FieldPropertiesEditor,
  Select,
  Input,
} from '@grafana/ui';


import { Options, GraphOptions, GraphDatasourceOptions } from './types';
import { GraphLegendEditor } from './GraphLegendEditor';

export class GraphPanelEditor extends PureComponent<PanelEditorProps<Options>> {
  datasources: DataSourceSelectItem[] = getDataSourceSrv().getMetricSources();

  constructor(props) {
    super(props)
    window.console.log("GraphPanelEditor", props);
  }

  datasourcesList = function() {
    var res = new Array({ label: 'Not selected', value: '' });

    this.datasources.forEach(function (val) {
      if (val.meta.id === "loudml-datasource") {
        res.push({label: val.name, value: val.value});
      }
    });

    return res;
  }

  onChangeDataSource = (value: any) => {
    this.props.options.datasourceOptions.datasource = value.value;
    this.setState({ value: value.value });
  };

  onChangeInputBucket = (event: any) => {
    this.props.options.datasourceOptions.input_bucket = event.target.value;
    this.setState({value: event.target.value});
  };

  onBlurInputBucket = () => {
    // window.console.log("onBlurInputBucket", this.state);
  };

  onChangeOutputBucket = (event: any) => {
    this.props.options.datasourceOptions.output_bucket = event.target.value;
    this.setState({value: event.target.value});
  };

  onBlurOutputBucket = () => {
    // window.console.log("onBlurOutputBucket", this.state);
  };

  onGraphOptionsChange = (options: Partial<GraphOptions>) => {
    this.props.onOptionsChange({
      ...this.props.options,
      graph: {
        ...this.props.options.graph,
        ...options,
      },
    });
  };

  onLegendOptionsChange = (options: LegendOptions) => {
    this.props.onOptionsChange({ ...this.props.options, legend: options });
  };

  onTooltipOptionsChange = (options: GraphTooltipOptions) => {
    this.props.onOptionsChange({ ...this.props.options, tooltipOptions: options });
  };

  onToggleLines = () => {
    this.onGraphOptionsChange({ showLines: !this.props.options.graph.showLines });
  };

  onToggleBars = () => {
    this.onGraphOptionsChange({ showBars: !this.props.options.graph.showBars });
  };

  onTogglePoints = () => {
    this.onGraphOptionsChange({ showPoints: !this.props.options.graph.showPoints });
  };

  onDefaultsChange = (field: FieldConfig) => {
    this.props.onOptionsChange({
      ...this.props.options,
      fieldOptions: {
        ...this.props.options.fieldOptions,
        defaults: field,
      },
    });
  };

  render() {
    const {
      graph: { showBars, showPoints, showLines },
      tooltipOptions: { mode },
      datasourceOptions: { datasource, input_bucket, output_bucket },
    } = this.props.options;

    return (
      <>
        <div className="section gf-form-group">
          <h5 className="section-heading">Draw Modes</h5>
          <Switch label="Lines" labelClass="width-5" checked={showLines} onChange={this.onToggleLines} />
          <Switch label="Bars" labelClass="width-5" checked={showBars} onChange={this.onToggleBars} />
          <Switch label="Points" labelClass="width-5" checked={showPoints} onChange={this.onTogglePoints} />
        </div>
        <div className="section gf-form-group">
          <h5 className="section-heading">Loud ML</h5>
          <div className="gf-form max-width-40">
            <span className="gf-form-label width-10">Loud ML Server</span>
            <Select
                value={{ value: datasource, label: datasource }}
                onChange={value => {
                  this.onChangeDataSource({ value: value.value as any });
                }}
                options={this.datasourcesList()}
              />
          </div>
          <div className="gf-form max-width-40">
            <span className="gf-form-label width-10">Input Bucket</span>
            <Input
              value={this.props.options.datasourceOptions.input_bucket}
              className="gf-form-input" type="text"
              placeholder="Datasource/Database used in Query"
              min-length="0"
              onBlur={this.onBlurInputBucket}
              onChange={this.onChangeInputBucket}
            />
          </div>
          <p>Bucket to get data for ML Model (Equal to Datasource used on Query tab; it should be in Loud ML YAML config)</p>

          <div className="gf-form max-width-40">
            <span className="gf-form-label width-10">Output Bucket</span>
            <Input
              value={this.props.options.datasourceOptions.output_bucket}
              className="gf-form-input" type="text"
              placeholder="Database to store ML Model training results"
              min-length="0"
              onBlur={this.onBlurOutputBucket}
              onChange={this.onChangeOutputBucket}
            />
          </div>
          <p>Specify a bucket to store ML training results (It should be in Loud ML YAML config)</p>

        </div>
        <PanelOptionsGrid>
          <PanelOptionsGroup title="Field">
            <FieldPropertiesEditor
              showMinMax={false}
              onChange={this.onDefaultsChange}
              value={this.props.options.fieldOptions.defaults}
            />
          </PanelOptionsGroup>
          <PanelOptionsGroup title="Tooltip">
            <Select
              value={{ value: mode, label: mode === 'single' ? 'Single' : 'All series' }}
              onChange={value => {
                this.onTooltipOptionsChange({ mode: value.value as any });
              }}
              options={[
                { label: 'All series', value: 'multi' },
                { label: 'Single', value: 'single' },
              ]}
            />
          </PanelOptionsGroup>
          <GraphLegendEditor options={this.props.options.legend} onChange={this.onLegendOptionsChange} />
        </PanelOptionsGrid>
      </>
    );
  }
}
