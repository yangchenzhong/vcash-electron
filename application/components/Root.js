import React from 'react'
import { hashHistory, IndexLink, Link } from 'react-router'
import { inject, observer } from 'mobx-react'
import { Button, Col, Icon, Menu, Popover, Row, Tooltip } from 'antd'

/** MobX DevTools. */
import DevTools from 'mobx-react-devtools'

/** Dialog components. */
import DaemonStatus from './DaemonStatus'
import Transaction from './Transaction'
import WalletEncrypt from './WalletEncrypt'
import WalletLock from './WalletLock'
import WalletUnlock from './WalletUnlock'

/** Inject MobX stores to props. */
@inject('rates')
@inject('transactions')
@inject('wallet')
@inject('walletEncrypt')
@inject('walletLock')
@inject('walletUnlock')

/** Make the component reactive. */
@observer

/** Root component class. */
class Root extends React.Component {
  constructor(props) {
    super(props)

    /** Set active nav menu item. */
    this.activeRoute = '/'

    /** Assign stores to component. */
    this.rates = props.rates
    this.transactions = props.transactions
    this.wallet = props.wallet
    this.walletEncrypt = props.walletEncrypt
    this.walletLock = props.walletLock
    this.walletUnlock = props.walletUnlock

    /** Bind functions early. */
    this.lock = this.lock.bind(this)
    this.toggleEncrypt = this.toggleEncrypt.bind(this)
    this.toggleUnlock = this.toggleUnlock.bind(this)
    this.setRoute = this.setRoute.bind(this)
  }

  lock() {
    this.walletLock.lock()
  }

  toggleEncrypt() {
    this.walletEncrypt.toggleDialog()
  }

  toggleUnlock() {
    this.walletUnlock.toggleDialog()
  }

  setRoute(e) {
    this.activeRoute = e.key
    hashHistory.push(this.activeRoute)
  }

  componentWillReceiveProps(props) {
    this.props = props
  }

  render() {
    return (
      <div>
        {process.env.NODE_ENV === 'dev' && <DevTools />}

        <WalletEncrypt />
        <WalletLock />
        <WalletUnlock />
        <DaemonStatus />
        <Transaction />

        <header className='shadow'>
          <Row>
            <Col span={1}>
              <div id='logo'>
                <Tooltip
                  placement='bottomLeft'
                  title={
                    <div>
                      <p>Vcash {this.wallet.version}</p>
                      <p>UI {process.env.npm_package_version}</p>
                      <br />
                      <p>Wallet {this.wallet.walletversion}</p>
                    </div>
                  }
                >
                  <img src='./assets/images/logoGrey.png' />
                </Tooltip>
              </div>
            </Col>
            <Col span={9}>
              <div id='balance'>
                <p>Balance</p>
                <Row>
                  <Col span={8}><p><span>{this.wallet.balance}</span> XVC</p></Col>
                  <Col span={8}><p><span>{(this.wallet.balance * this.rates.average).toFixed(8)}</span> BTC</p></Col>
                  <Col span={8}><p><span>{(this.wallet.balance * this.rates.average * this.rates.local).toFixed(2)}</span> {this.rates.localCurrency}</p></Col>
                </Row>
              </div>
            </Col>
            <Col span={13}>
              <nav>
                <Menu onClick={this.setRoute} selectedKeys={[this.activeRoute]} mode='horizontal'>
                  <Menu.Item key="/"><i className='material-icons md-20'>receipt</i> Transactions</Menu.Item>
                  <Menu.Item key="send"><i className='material-icons md-20'>send</i> Send</Menu.Item>
                  <Menu.Item key="receive"><i className='material-icons md-20'>plus_one</i> Receive</Menu.Item>
                  <Menu.Item key="network"><i className='material-icons md-20'>router</i> Network</Menu.Item>
                  <Menu.Item key="maintenance"><i className='material-icons md-20'>settings</i> Maintenance</Menu.Item>
                </Menu>
              </nav>
            </Col>
            <Col span={1}>
              {
                this.wallet.isLocked && this.wallet.isEncrypted &&
                (
                  <Tooltip placement='bottomRight' title='Wallet is locked'>
                    <Button size='small' type='primary' onClick={this.toggleUnlock}>
                      <i className='material-icons md-20'>lock</i>
                    </Button>
                  </Tooltip>
                ) ||
                !this.wallet.isLocked && this.wallet.isEncrypted &&
                (
                  <Tooltip placement='bottomRight' title='Wallet is unlocked'>
                    <Button size='small' type='primary' onClick={this.lock}>
                      <i className='material-icons md-20'>lock_open</i>
                    </Button>
                  </Tooltip>
                ) ||
                !this.wallet.isEncrypted && !this.wallet.isLocked &&
                (
                  <Tooltip placement='bottomRight' title='Wallet is not encrypted'>
                    <Button size='small' type='primary' onClick={this.toggleEncrypt}>
                      <i className='material-icons md-20'>vpn_key</i>
                    </Button>
                  </Tooltip>
                )
              }
            </Col>
          </Row>
        </header>
        <main>{this.props.children}</main>
      </div>
    )
  }
}

export default Root