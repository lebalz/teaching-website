import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import LocaleDropdownNavbarItem from '@theme/NavbarItem/LocaleDropdownNavbarItem';
import SearchNavbarItem from '@theme/NavbarItem/SearchNavbarItem';
import HtmlNavbarItem from '@theme/NavbarItem/HtmlNavbarItem';
import DocNavbarItem from '@theme/NavbarItem/DocNavbarItem';
import DocSidebarNavbarItem from '@theme/NavbarItem/DocSidebarNavbarItem';
import DocsVersionNavbarItem from '@theme/NavbarItem/DocsVersionNavbarItem';
import DocsVersionDropdownNavbarItem from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';

import type { ComponentTypesObject } from '@theme/NavbarItem/ComponentTypes';
import { default as LoginProfileButton } from '@site/src/components/Navbar/LoginProfileButton';

const ComponentTypes: ComponentTypesObject = {
    default: DefaultNavbarItem,
    localeDropdown: LocaleDropdownNavbarItem,
    search: SearchNavbarItem,
    dropdown: DropdownNavbarItem,
    html: HtmlNavbarItem,
    doc: DocNavbarItem,
    docSidebar: DocSidebarNavbarItem,
    docsVersion: DocsVersionNavbarItem,
    docsVersionDropdown: DocsVersionDropdownNavbarItem,
    ['custom-loginProfileButton']: LoginProfileButton
};

export default ComponentTypes;
