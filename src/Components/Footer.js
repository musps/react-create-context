import React, { Component } from 'react';

const Footer = (props) => (
  <div>
    <ul>
      {Object.entries(props.ThemeContext.data).map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

export default Footer;
