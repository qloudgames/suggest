import * as React from 'react';
import { Link } from 'react-router-dom';
import styles from './component_util.module.css';
import * as classNames from 'classnames';

export const InlineSeparator = () => <span style={{ color: 'black', textDecoration: 'bold' }}>&nbsp;|&nbsp;</span>;

export const StyledLink = ({ to, children, className, enabled = true }: { to: string, className?: string, children: any, enabled: boolean }) => (
  enabled
    ? <Link to={to} className={classNames(styles.link, className)}>{children}</Link>
    : children
);
