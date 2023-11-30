/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { GeoJSONSource } from "mapbox-gl";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { CustomSelect } from "../../../components";
import { sourceName, layerName } from "../../../config/constants/constants";
import useMapStore from "../../map/store/useMapStore";
import fieldContent from "../content/fieldContent.json";
import searchService from "../service/searchService";
import RadioInput from "./RadioInput";

interface IFilterForm {
  address: string;
  tipeIklan: string;
  tipeProperti: string;
  luasBangunanMin: number;
  luasBangunanMax: number;
  luasTanahMin: number;
  luasTanahMax: number;
  kamarTidur: number;
  kamarMandi: number;
}

interface FilterPropertyProps {}

const FilterProperty: FC<FilterPropertyProps> = () => {
  const { handleSubmit, register, control } = useForm<IFilterForm>();
  const map = useMapStore((state) => state.map);

  const mutateFilterProperty = useMutation({
    mutationFn: (coordinate: number[]) =>
      searchService.searchPropertyByLocation(coordinate),
    onSuccess: (data) => {
      if (!map) return;

      const geoJsonSource = map.getSource(
        sourceName.resultProperty
      ) as GeoJSONSource;
      if (geoJsonSource) {
        geoJsonSource.setData(data as any);
        return;
      }
    },
  });

  const onSubmit = (data: IFilterForm) => {
    console.log(data);
    console.log(String(data.kamarTidur) !== "");
    if (!map) return;

    const operator = [
      "all",
      data.tipeIklan ? ["==", ["get", "type_ads"], data.tipeIklan] : true,
      data.tipeProperti
        ? ["==", ["get", "type_property"], data.tipeProperti]
        : true,
      String(data.luasBangunanMin) !== "" && String(data.luasBangunanMax) !== ""
        ? [
            "all",
            ["<=", ["get", "building_area"], Number(data.luasBangunanMax)],
            [">=", ["get", "building_area"], Number(data.luasBangunanMin)],
          ]
        : true,
      String(data.luasTanahMin) !== "" && String(data.luasTanahMax) !== ""
        ? [
            "all",
            ["<=", ["get", "building_area"], Number(data.luasTanahMax)],
            [">=", ["get", "building_area"], Number(data.luasTanahMin)],
          ]
        : true,
      data.kamarTidur
        ? [">=", ["get", "bed_rooms"], Number(data.kamarTidur)]
        : true,
      data.kamarMandi
        ? [">=", ["get", "bath_rooms"], Number(data.kamarMandi)]
        : true,
    ];

    console.log(operator);

    map.setFilter(layerName.polygonLayer, operator);
  };

  const onChange = (coordinate: string | number[] | undefined) => {
    if (!map) return;
    if (!Array.isArray(coordinate)) return;
    map.flyTo({
      center: [coordinate[0], coordinate[1]],
      zoom: 15,
    });
    mutateFilterProperty.mutate(coordinate);
  };

  const loadOptions = (inputValue: string) => {
    return new Promise((resolve) => {
      const result = searchService.searchProperty(inputValue).then((res) => {
        return res.data?.map((item) => ({
          label: item.name,
          value: item.center_point,
        }));
      });
      resolve(result);
    });
  };

  return (
    <VStack
      w="full"
      alignItems="start"
      gap="8"
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <HStack justifyContent="space-between" alignItems="end" w="full">
        <Heading as="h1" size="lg">
          Filter Property
        </Heading>
        <Text>Reset filter</Text>
      </HStack>
      <CustomSelect
        options={[
          {
            label: "Pancoran mas, Depok",
            value: "Pancoran mas, Depok",
          },
          { label: "Beji, Depok", value: "Beji, Depok" },
        ]}
        placeholder="Masukan lokasi (Khusus daerah depok)"
        isClearable
        onChange={(value) => {
          onChange(value as number[]);
        }}
        optionsIcon={FaMapMarkerAlt}
        dropdownIndicator={FaSearch}
        loadOptions={loadOptions}
      />
      <Divider />
      <FormControl>
        <FormLabel color="gray.600">Tipe Iklan</FormLabel>
        <Controller
          name="tipeIklan"
          control={control}
          render={({ field }) => (
            <>
              <RadioInput
                name={field.name}
                onChange={field.onChange}
                options={fieldContent.tipeIklan}
              />
            </>
          )}
        />
      </FormControl>
      <FormControl>
        <FormLabel color="gray.600">Tipe Properti</FormLabel>
        <Controller
          name="tipeProperti"
          control={control}
          render={({ field }) => (
            <>
              <RadioInput
                name={field.name}
                onChange={field.onChange}
                options={fieldContent.tipeProperti}
              />
            </>
          )}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Luas Bangunan (m2)</FormLabel>
        <HStack gap={4}>
          <Input {...register("luasBangunanMin")} type="number" />
          <Input {...register("luasBangunanMax")} type="number" />
        </HStack>
      </FormControl>
      <FormControl>
        <FormLabel>Luas Tanah (m2)</FormLabel>
        <HStack gap={4}>
          <Input {...register("luasTanahMin")} type="number" />
          <Input {...register("luasTanahMax")} type="number" />
        </HStack>
      </FormControl>
      <FormControl>
        <FormLabel color="gray.600">Kamar Tidur</FormLabel>
        <Controller
          name="kamarTidur"
          control={control}
          render={({ field }) => (
            <>
              <RadioInput
                name={field.name}
                onChange={field.onChange}
                options={fieldContent.kamarTidur}
                gridTemplateColumns="5"
              />
            </>
          )}
        />
      </FormControl>
      <FormControl>
        <FormLabel color="gray.600">Kamar Tidur</FormLabel>
        <Controller
          name="kamarMandi"
          control={control}
          render={({ field }) => (
            <>
              <RadioInput
                name={field.name}
                onChange={field.onChange}
                options={fieldContent.kamarMandi}
                gridTemplateColumns="5"
              />
            </>
          )}
        />
      </FormControl>
      <Button type="submit" bg="blue.500" w="full" color="white" size="lg">
        Filter
      </Button>
    </VStack>
  );
};

export default FilterProperty;
