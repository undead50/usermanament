import MyRoutes from './routes';
import { ConfigProvider } from 'antd';
function App() {
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              colorPrimary: '#FDB912',
              // colorPrimaryBgHover:'green'
            },
          },
          token: {
            // fontFamily: 'Poppins', // replace with your desired font,
            // fontSize: 12,
            sizeStep: 4,
            sizeUnit: 2,
            dropdownBg: 'white',
            // borderRadius: 4,

            // colorInfo: '#0067b2',
            colorPrimary: '#920E13',
            // colorSuccess: '#42b086',
            // borderRadiusXS: 16,
            // borderRadiusSM: 16,
            // borderRadius: 16,
            // borderRadiusLG: 16,
          },
        }}
      >
        <MyRoutes />
      </ConfigProvider>
    </>
  );
}

export default App;
