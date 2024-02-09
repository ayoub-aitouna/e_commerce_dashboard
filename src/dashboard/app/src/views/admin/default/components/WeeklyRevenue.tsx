// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card";
// Custom components
import BarChart from "components/charts/BarChart";
import { StatisticsStore, Filters } from "states/statistics";
import {
  barChartOptionsConsumption,
} from "variables/charts";
import { MdBarChart } from "react-icons/md";
import { useEffect } from "react";

export default function WeeklyRevenue(props: { [x: string]: any, filter: Filters }) {
  const { filter, ...rest } = props;

  const { WeekState, getWeekSatate } = StatisticsStore((state) => ({
    WeekState: state.WeekState,
    getWeekSatate: state.getWeekSatate,
  }));

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const iconColor = useColorModeValue("brand.500", "white");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );

  useEffect(() => {
    getWeekSatate(filter);
    console.log("WeeklyRevenue.tsx", WeekState);
  }, [filter]);

  useEffect(() => {
    console.log("WeeklyRevenue.tsx", WeekState);
  }, [WeekState]);

  return (
    <Card alignItems="center" flexDirection="column" w="100%" {...rest}>
      <Flex align="center" w="100%" px="15px" py="10px">
        <Flex me="auto" gap={2} >
          <Text
            me="auto"
            color={textColor}
            fontSize="4xl"
            fontWeight="800"
            lineHeight="100%"
          >
            {WeekState.today}
          </Text>
          <Text>
            {new Date().toLocaleDateString("default", { weekday: "long" })}{"'s "}
            Sells
          </Text>
        </Flex>

        <Button
          alignItems="center"
          justifyContent="center"
          bg={bgButton}
          _hover={bgHover}
          _focus={bgFocus}
          _active={bgFocus}
          w="37px"
          h="37px"
          lineHeight="100%"
          borderRadius="10px"
          {...rest}
        >
          <Icon as={MdBarChart} color={iconColor} w="24px" h="24px" />
        </Button>
      </Flex>

      <Box h="240px" mt="auto" w="100%">
        {WeekState.daysOfWeek && WeekState.daysOfWeek.length === 0 ? null : (
          <BarChart
            key={WeekState.daysOfWeek.reduce((a, b) => a + b, 0)} // Add this line
            chartData={[
              {
                name: "Sells",
                data: WeekState.daysOfWeek,
              },
            ]}
            chartOptions={barChartOptionsConsumption}
          />
        )}
      </Box>
    </Card>
  );
}
