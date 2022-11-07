import { useState } from "react";
import { Heading, useToast, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { api } from "../services/api";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function FindPools() {
	const [isLoading, setIsLoading] = useState(true);
	const [code, setCode] = useState("");

	const toast = useToast();
	const { navigate } = useNavigation();

	async function handleJoinPool() {
		try {
			setIsLoading(true);
			if (!code.trim()) {
				return toast.show({
					title: "Informe o código do bolão!",
					placement: "top",
					bgColor: "red.500",
				});
			}

			await api.post("/pools/join", { code });

			toast.show({
				title: "Você foi adicionado ao bolão com sucesso!",
				placement: "top",
				bgColor: "green.500",
			});

			navigate("showPools");
		} catch (error) {
			console.log("error ", error);
			setIsLoading(false);

			if (error.response?.data?.message === "Pool not found.") {
				return toast.show({
					title: "Bolão não encontrado!",
					placement: "top",
					bgColor: "red.500",
				});
			}

			if (
				error.response?.data?.message ===
				"You already joined this pool."
			) {
				return toast.show({
					title: "Você já está nesse bolão!",
					placement: "top",
					bgColor: "red.500",
				});
			}

			toast.show({
				title: "Não foi possível encontrar o bolão.",
				placement: "top",
				bgColor: "red.500",
			});
		} finally {
			setCode("");
			setIsLoading(false);
		}
	}

	return (
		<VStack flex={1} bgColor="gray.900">
			<Header title="Buscar por código" showBackButton />
			<VStack mt={8} mx={5} alignItems="center">
				<Heading
					fontFamily="heading"
					color="white"
					fontSize="xl"
					mb={8}
					textAlign="center"
				>
					Encontre um bolão através de {"\n"} seu código único
				</Heading>
				<Input
					mb={2}
					placeholder="Qual o código do bolão?"
					autoCapitalize="characters"
					onChangeText={setCode}
					value={code}
				/>
				<Button
					title="Buscar bolão"
					isLoading={isLoading}
					onPress={handleJoinPool}
				/>
			</VStack>
		</VStack>
	);
}
