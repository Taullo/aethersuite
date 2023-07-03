//  Package imports.
import PropTypes from 'prop-types';

import { defineMessages, injectIntl } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import Toggle from 'react-toggle';


//  Components.
import { IconButton } from 'flavours/aether/components/icon_button';
import { pollLimits } from 'flavours/aether/initial_state';

import DropdownContainer from '../containers/dropdown_container';
import LanguageDropdown from '../containers/language_dropdown_container';



//  Utils.

//  Messages.
const messages = defineMessages({
  advanced_options_icon_title: {
    defaultMessage: 'Advanced options',
    id: 'advanced_options.icon_title',
  },
  attach: {
    defaultMessage: 'Attach...',
    id: 'compose.attach',
  },
  content_type: {
    defaultMessage: 'Content type',
    id: 'content-type.change',
  },
  doodle: {
    defaultMessage: 'Draw something',
    id: 'compose.attach.doodle',
  },
  html: {
    defaultMessage: 'HTML',
    id: 'compose.content-type.html',
  },
  local_only_long: {
    defaultMessage: 'Do not post to other instances',
    id: 'advanced_options.local-only.long',
  },
  local_only_short: {
    defaultMessage: 'Local only',
    id: 'advanced_options.local-only.short',
  },
  markdown: {
    defaultMessage: 'Markdown',
    id: 'compose.content-type.markdown',
  },
  plain: {
    defaultMessage: 'Plain text',
    id: 'compose.content-type.plain',
  },
  spoiler: {
    defaultMessage: 'Toggle content warning',
    id: 'compose_form.spoiler.unmarked',
  },
  threaded_mode_long: {
    defaultMessage: 'Automatically opens a reply on posting',
    id: 'advanced_options.threaded_mode.long',
  },
  threaded_mode_short: {
    defaultMessage: 'Threaded mode',
    id: 'advanced_options.threaded_mode.short',
  },
  upload: {
    defaultMessage: 'Upload a file',
    id: 'compose.attach.upload',
  },
  add_poll: {
    defaultMessage: 'Add a poll',
    id: 'poll_button.add_poll',
  },
  remove_poll: {
    defaultMessage: 'Remove poll',
    id: 'poll_button.remove_poll',
  },
});

const mapStateToProps = (state, { name }) => ({
  checked: state.getIn(['compose', 'advanced_options', name]),
});

class ToggleOptionImpl extends ImmutablePureComponent {

  static propTypes = {
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    onChangeAdvancedOption: PropTypes.func.isRequired,
  };

  handleChange = () => {
    this.props.onChangeAdvancedOption(this.props.name);
  };

  render() {
    const { meta, text, checked } = this.props;

    return (
      <>
        <Toggle checked={checked} onChange={this.handleChange} />

        <div className='privacy-dropdown__option__content'>
          <strong>{text}</strong>
          {meta}
        </div>
      </>
    );
  }

}

const ToggleOption = connect(mapStateToProps)(ToggleOptionImpl);

class ComposerOptions extends ImmutablePureComponent {

  static propTypes = {
    acceptContentTypes: PropTypes.string,
    advancedOptions: ImmutablePropTypes.map,
    disabled: PropTypes.bool,
    allowMedia: PropTypes.bool,
    hasPoll: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    onChangeAdvancedOption: PropTypes.func,
    onChangeContentType: PropTypes.func,
    onTogglePoll: PropTypes.func,
    onDoodleOpen: PropTypes.func,
    onToggleSpoiler: PropTypes.func,
    onUpload: PropTypes.func,
    contentType: PropTypes.string,
    resetFileKey: PropTypes.number,
    spoiler: PropTypes.bool,
    showContentTypeChoice: PropTypes.bool,
    isEditing: PropTypes.bool,
  };

  //  Handles file selection.
  handleChangeFiles = ({ target: { files } }) => {
    const { onUpload } = this.props;
    if (files.length && onUpload) {
      onUpload(files);
    }
  };

  //  Handles attachment clicks.
  handleClickAttach = (name) => {
    const { fileElement } = this;
    const { onDoodleOpen } = this.props;

    //  We switch over the name of the option.
    switch (name) {
    case 'upload':
      if (fileElement) {
        fileElement.click();
      }
      return;
    case 'doodle':
      if (onDoodleOpen) {
        onDoodleOpen();
      }
      return;
    }
  };

  //  Handles a ref to the file input.
  handleRefFileElement = (fileElement) => {
    this.fileElement = fileElement;
  };

  renderToggleItemContents = (item) => {
    const { onChangeAdvancedOption } = this.props;
    const { name, meta, text } = item;

    return <ToggleOption name={name} text={text} meta={meta} onChangeAdvancedOption={onChangeAdvancedOption} />;
  };

  //  Rendering.
  render () {
    const {
      acceptContentTypes,
      advancedOptions,
      contentType,
      disabled,
      allowMedia,
      hasPoll,
      onChangeAdvancedOption,
      onChangeContentType,
      onTogglePoll,
      onToggleSpoiler,
      resetFileKey,
      spoiler,
      isEditing,
      intl: { formatMessage },
    } = this.props;

    const contentTypeItems = {
      plain: {
        icon: 'file-text',
        name: 'text/plain',
        text: formatMessage(messages.plain),
      },
      html: {
        icon: 'code',
        name: 'text/html',
        text: formatMessage(messages.html),
      },
      markdown: {
        icon: 'arrow-circle-down',
        name: 'text/markdown',
        text: formatMessage(messages.markdown),
      },
    };

    //  The result.
    return (
      <div className='compose-form__buttons'>
        <input
          accept={acceptContentTypes}
          disabled={disabled || !allowMedia}
          key={resetFileKey}
          onChange={this.handleChangeFiles}
          ref={this.handleRefFileElement}
          type='file'
          multiple
          style={{ display: 'none' }}
        />
        <DropdownContainer
          disabled={disabled || !allowMedia}
          icon='paperclip'
          items={[
            {
              icon: 'cloud-upload',
              name: 'upload',
              text: formatMessage(messages.upload),
            },
            {
              icon: 'paint-brush',
              name: 'doodle',
              text: formatMessage(messages.doodle),
            },
          ]}
          onChange={this.handleClickAttach}
          title={formatMessage(messages.attach)}
        />
        {!!pollLimits && (
          <IconButton
            active={hasPoll}
            icon='tasks'
            inverted
            onClick={onTogglePoll}
            size={18}
            style={{
              height: null,
              lineHeight: null,
            }}
            title={formatMessage(hasPoll ? messages.remove_poll : messages.add_poll)}
          />
        )}
        {onToggleSpoiler && (
          <IconButton
            active={spoiler}
            ariaControls='glitch.composer.spoiler.input'
            icon='warning'
            size={18}
            style={{
              height: null,
              lineHeight: null,
            }}
            onClick={onToggleSpoiler}
            title={formatMessage(messages.spoiler)}
          />
        )}
        <hr />

        <DropdownContainer
          disabled={disabled}
          icon='file-text'
          items={[
            contentTypeItems.markdown,
            contentTypeItems.html,
            contentTypeItems.plain,
          ]}
          onChange={onChangeContentType}
          title={formatMessage(messages.content_type)}
          value={contentType}
        />
        <LanguageDropdown />
        <DropdownContainer
          disabled={disabled || isEditing}
          icon='ellipsis-h'
          items={advancedOptions ? [
            {
              meta: formatMessage(messages.local_only_long),
              name: 'do_not_federate',
              text: formatMessage(messages.local_only_short),
            },
            {
              meta: formatMessage(messages.threaded_mode_long),
              name: 'threaded_mode',
              text: formatMessage(messages.threaded_mode_short),
            },
          ] : null}
          onChange={onChangeAdvancedOption}
          renderItemContents={this.renderToggleItemContents}
          title={formatMessage(messages.advanced_options_icon_title)}
          closeOnChange={false}
        />
      </div>
    );
  }

}
export default injectIntl(ComposerOptions);