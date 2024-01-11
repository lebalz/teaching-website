import {jsxFlowElementFrom} from "../../../plugins/shared/util/jsx-node-util";
import {ImportType} from "../../../plugins/shared/models";
import {LeafDirectiveDeclaration, LeafDirectiveTransformerProps,} from "../../../plugins/remark-line-directives/model";
import {Optional} from "../../../util/optional";
import {Log} from "../../../util/log";
import {definedAttributes} from "../../../plugins/shared/util/plugin-config-util";

interface Props extends LeafDirectiveTransformerProps {
  width?: string;
}

export default {
  name: 'youtube',
  transform: ({literal, width}: Props) => {
    if (!literal) {
      Log.instance.warn(`Missing literal on 'youtube' directive`);
      return Optional.empty();
    }

    return Optional.of(jsxFlowElementFrom({
      componentName: 'YouTubeVideo',
      attributes: definedAttributes([
        {name: "videoUrl", value: literal},
        {name: "width", value: width},
      ])
    }));
  },
  esmImports: [{
    sourcePackage: '@site/src/app/components/YouTubeVideo',
    specifiers: [{type: ImportType.DEFAULT_IMPORT, name: 'YouTubeVideo'}],
  }],
} as LeafDirectiveDeclaration<Props>

