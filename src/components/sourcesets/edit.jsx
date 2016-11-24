import { filter } from 'lodash';
import React from 'React';
import PageEdit from '../pageEdit';
import { connect } from 'react-redux';

class Edit extends React.Component {
  constructor (props) {
    super(props);
    if (!this.props.item.length) return null;
  }
  render() {
    return (
      <PageEdit item={this.props.item}>Sourceset edit form</PageEdit>
    );
  }
}

let mapStateToProps = ({ sourcesets, sources }, ownProps) => {
  let item = filter(sourcesets, {id: parseInt(ownProps.params.id)});
  return {
    item: item,
    sources: (item.length) ? filter(sources, (source) => item.source_ids.indexOf(source.id) > -1) : false
  };
};

export default connect(mapStateToProps)(Edit);