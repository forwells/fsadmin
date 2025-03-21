import { QueryProvider } from "./providers/QueryProvider";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, theme } from "antd";
import { BrowserRouter } from "react-router-dom";
import LayoutHandler from './layouts/LayoutHandler';
import zhCN from 'antd/locale/zh_CN';
// for date-picker i18n
import 'dayjs/locale/zh-cn';
import { Provider as ReduxProvider } from 'react-redux'
import store from "./states/store";

function App() {
  /** @type {import('antd').ConfigProviderProps} */
  const theme_cfg = {
    locale: zhCN,
    theme: {
      algorithm: theme.defaultAlgorithm,
      token: {
        colorPrimary: '#763aca',
        colorInfo: '#763aca',
        borderRadius: 5,
      },
      components: {
        Layout: {
          headerHeight: '50px',
          headerPadding: '0 10px',
        },
        Button: {
          primaryShadow: false,
          borderRadius: 5,
        },
        Table: {
        }
      }

    }
  }

  return (
    <>
      <ReduxProvider store={store}>
        <BrowserRouter>
          <QueryProvider>
            <ConfigProvider {...theme_cfg}>
              <StyleProvider hashPriority={'high'}>
                <LayoutHandler />
              </StyleProvider>
            </ConfigProvider>
          </QueryProvider>
        </BrowserRouter>
      </ReduxProvider>
    </>
  )
}

export default App
