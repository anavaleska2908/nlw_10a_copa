import { useCallback, useState } from "react";
import { VStack, Icon, useToast, FlatList } from "native-base";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Octicons } from "@expo/vector-icons";
import { api } from "../services/api";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PoolCard, PoolCardProps } from "../components/PoolCard";
import { EmptyPoolList } from "../components/EmptyPoolList";

export function ShowPools() {
	const [isLoading, setIsLoading] = useState(true);
	const [pools, setPools] = useState<PoolCardProps[]>([]);

	const { navigate } = useNavigation();
	const toast = useToast();

	async function fetchPools() {
		try {
			setIsLoading(true);
			const response = await api.get("/pools");
			setPools(response.data.pools);
		} catch (error) {
			console.log("error ", error);

			toast.show({
				title: "Não foi possível carregar os bolões.",
				placement: "top",
				bgColor: "red.500",
			});
		} finally {
			setIsLoading(false);
		}
	}

	useFocusEffect(
		useCallback(() => {
			fetchPools();
		}, []),
	);

	return (
		<VStack flex={1} bgColor="gray.900">
			<Header title="Meus bolões" />
			<VStack
				mt={6}
				mx={5}
				borderBottomWidth={1}
				borderBottomColor="gray.600"
				pb={4}
				mb={4}
			>
				<Button
					title="Buscar bolão por código"
					leftIcon={
						<Icon
							as={Octicons}
							name="search"
							color="black"
							size="md"
						/>
					}
					onPress={() => navigate("findPools")}
				/>
			</VStack>
			{isLoading ? (
				<Loading />
			) : (
				<FlatList
					data={pools}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<PoolCard
							data={item}
							onPress={() =>
								navigate("detailsPool", { id: item.id })
							}
						/>
					)}
					ListEmptyComponent={() => <EmptyPoolList />}
					showsVerticalScrollIndicator={false}
					_contentContainerStyle={{ pb: 10 }}
					px={5}
				/>
			)}
		</VStack>
	);
}